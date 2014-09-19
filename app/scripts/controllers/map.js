'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/heat-map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {
          geoData: function($q, $http) {
            var deferred = $q.defer();
            $http.get('/scripts/map-data/lgaBoundaries.json.geojson')
              .success(function(geoData) {
                deferred.resolve(geoData.features);
              })
              .error(function(reason) {
                deferred.reject(reason);
              });
            return deferred.promise;
          }
        }
      })
  })
  .controller('MapCtrl', function ($scope, geoData) {

    $scope.initiateMap = function() {

      geoData = geoData
        .map(function(feature) {
          feature.properties.stockBuffer = Math.random() * (200 - 10) + 10;
          return feature;
        });
      var gradient = ["#EB0C0C", "#E70E1E", "#E31031", "#E01244", "#DC1456", "#D91669", "#D5187C", "#D11A8E", "#CE1CA1", "#CA1EB4", "#C720C7", "#B223C3", "#9E26C0", "#8A29BC", "#762CB9", "#6230B5", "#4E33B2", "#3A36AE", "#2639AB", "#123DA8"];
      function getColor(d) {
        d = parseInt(d);
        return d > 190 ? gradient[0] :
            d > 180  ? gradient[1] :
            d > 170  ? gradient[2] :
            d > 160  ? gradient[3] :
            d > 160  ? gradient[4] :
            d > 150   ? gradient[5] :
            d > 140   ? gradient[6] :
            d > 130   ? gradient[7] :
            d > 120   ? gradient[8] :
            d > 110   ? gradient[9] :
            d > 100   ? gradient[10] :
            d > 90   ? gradient[11] :
            d > 80   ? gradient[12] :
            d > 70   ? gradient[13] :
            d > 60   ? gradient[14] :
            d > 40   ? gradient[15] :
            d > 30   ? gradient[16] :
            d > 20   ? gradient[17] :
            d > 10   ? gradient[18] :
          gradient[19];
      }

      function style(feature) {
        return {
          fillColor: getColor(feature.properties.stockBuffer),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        };
      }

      var map = L.map('map').setView([11.766343152000042, 8.582422330000043], 8);




      var info = L.control();
      info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
      };
      info.update = function (props) {
        this._div.innerHTML = '<h4>Stock Buffer For LGA</h4>' + (props ?
          '<b>' + props.LGAName + '</b><br />' + Math.floor(props.stockBuffer) + ' <sup></sup>'
          : 'Hover over an LGA');
      };
      info.addTo(map);
// get color depending on population density value

      function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
        info.update(layer.feature.properties);
      }
      var geojson;
      function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
      }
      function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
      }
      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
        });
      }

      geojson = L.geoJson(geoData, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(map);

      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
          grades = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190],
          labels = [],
          from, to;
        for (var i = 0; i < grades.length; i++) {
          from = grades[i];
          to = grades[i + 1];
          labels.push(
              '<i style="background:' + getColor(from + 1) + '"></i> ' +
              from + (to ? '&ndash;' + to : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
      };
      legend.addTo(map);
      if (!$scope.$$phase) {
        $scope.$apply();
      }

    }
  });