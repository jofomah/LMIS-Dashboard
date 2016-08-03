'use strict';

angular.module('lmisApp')
  .factory('wasteCountFactory', function($http, $q, ProductProfile, UomFactory, ProductType, ProductPresentation, Facility) {
    var URL = '/api/waste_count';
    var wasteReasons = [
      'VVM Stage 3',
      'VVM Stage 4',
      'Broken Vial',
      'Label Missing',
      'Unopened Expiry',
      'Opened Expiry',
      'Suspected Freezing',
      'Other'
    ];

    function getAll() {
      var d = $q.defer();

      $http.get(URL)
        .success(function(data) {
          d.resolve(data)
        })
        .error(function(err) {
          console.log(err);
          d.reject(err);
        });

      return d.promise;
    }

    function getDocFromRows(rows) {
      var docs = [];
      rows.forEach(function(row) {
        docs.push(row.doc);
      });
      return docs;
    }

    function getFormattedWasteCount() {

      var deferred = $q.defer();
      var promises = [
        getAll(),
        Facility.all(),
        ProductProfile.all(),
        UomFactory.all(),
        ProductPresentation.all(),
        ProductType.all()
      ];

      $q.all(promises)
        .then(function(resolved) {
          var wasteCounts = resolved[0],
              facilities = resolved[1],
              productProfiles = resolved[2],
              uomList = resolved[3],
              productPresentation = resolved[4],
              productTypes = resolved[5];
          var formattedWasteCount = [];
          wasteCounts
            .forEach(function(wasteCount) {
              if (angular.isDefined(facilities[wasteCount.facility])) {
                var list = {
                  uuid: wasteCount.uuid,
                  facilityName: angular.isUndefined(facilities[wasteCount.facility]) ? wasteCount.facility : facilities[wasteCount.facility].name,
                  facility: angular.isUndefined(facilities[wasteCount.facility]) ? wasteCount.facility : facilities[wasteCount.facility],
                  created: wasteCount.created,
                  reasons: [],
                  productLevelList: {},
                  wasteCount: {}
                };

                var tempdiscardedExtended = {}
                var isHistoric = true;
                if (wasteCount.discardedExtended) {
                  tempdiscardedExtended = wasteCount.discardedExtended
                  isHistoric = false;
                } else {
                  tempdiscardedExtended = wasteCount.discarded
                }

                if (tempdiscardedExtended) {
                  (Object.keys(tempdiscardedExtended)).forEach(function (productProfileUUID) {

                  if (angular.isDefined(productProfiles[productProfileUUID])) {
                    var uom = ""
                    if (isHistoric) {
                      uom = uomList[productPresentation[productProfiles[productProfileUUID].presentation].uom].symbol;
                    }else {
                      uom = tempdiscardedExtended[productProfileUUID].UoM
                    }
                    console.log("presentation", productPresentation)
                    list.productLevelList[productProfileUUID] = (Object.keys(wasteCount.reason[productProfileUUID])).length;

                    (Object.keys(wasteCount.reason[productProfileUUID]))
                      .forEach(function (reason, index) {
                        list.reasons.push({
                          uuid: wasteCount.uuid,
                          productIndex: index,
                          value: wasteCount.reason[productProfileUUID][reason],
                          multiplier: productPresentation[productProfiles[productProfileUUID].presentation].value,
                          key: productProfileUUID,
                          productProfile: productProfiles[productProfileUUID].name,
                          reason: wasteReasons[reason],
                          uom: uom,
                          created: wasteCount.created,
                          productList: (Object.keys(wasteCount.discarded)).length,
                          productType: productTypes[productProfiles[productProfileUUID].product].code
                        });

                      });

                    }

                  });
                }
                formattedWasteCount.push(list);
              }
            });

          deferred.resolve(formattedWasteCount);
        })
        .catch(function(reason) {
          deferred.reject(reason);
        });

      return deferred.promise;
    }

    return {
      all: getAll,
      getFormatted: getFormattedWasteCount
    }
  });
