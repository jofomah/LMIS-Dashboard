var expect = require('expect.js');
var _ = require('lodash');
var app = require('../../app');
var StockCountModel = require('./stock_count.model');
var stockCountMock;
var productTypesMock;
var facilityProgramProductsMock;
var productProfilesMock;
var uomListMock;
var productCountMock;


beforeEach(function() {
  stockCountMock = _.cloneDeep(require('./stock_count.mock'));
  productTypesMock = _.cloneDeep(require('../product_type/product_type.mock')).productTypes;
  facilityProgramProductsMock = _.cloneDeep(require('../facility_program_products/facility_program_products.mock')).facilityProgramProducts;
  productProfilesMock =_.cloneDeep(require('../product_profile/product_profile.mock')).productProfiles;
  uomListMock = _.cloneDeep(require('../uom/uom.mock')).UOMList;
  productCountMock = stockCountMock.expectedProductCounts;
});

describe('StockCount', function() {

  describe('pickMostRecentUniqueStockCount', function () {
    it('Should not return most recent stock count without duplicates', function () {
      var result = StockCountModel.pickFacilityMostRecentStockCount(stockCountMock.expectedFacilityStocks);
      var testFacilityId = 'ntf@a.org';
      var facilityStockCounts = stockCountMock.expectedFacilityStocks
        .filter(function (sc) {
          return sc.facility._id === testFacilityId;
        })
        .sort(function (a, b) {
          var result = (new Date(b.countDate).getTime() - new Date(a.countDate).getTime());
          var isEqual = result === 0;
          return isEqual? (new Date(b.created).getTime() - new Date(a.created).getTime()) : result;
        });
      expect(result[0]).to.eql(facilityStockCounts[0])
    });
  });

  describe('buildProductCount', function () {
    it('should return array of product counts with Product Type object and expected structure', function () {
      var productCounts = stockCountMock.stockCounts[0].productCounts;
      var programProductById = _.indexBy(facilityProgramProductsMock, 'productProfileId');
      var resultSet = [].concat(uomListMock, productTypesMock, productProfilesMock, facilityProgramProductsMock)
      var resultSetById = _.indexBy(resultSet, '_id');
      var result = StockCountModel.buildProductCount(productCounts, resultSetById, programProductById);
      expect(result).to.eql(productCountMock)
    });
  });

  describe('sortByDate', function() {
    it('sort by "countDate" in descending order i.e from most recent date to older dates', function() {
      var firstCountDate = new Date(stockCountMock.stockCounts[0].countDate).getTime();
      var secondCountDate = new Date(stockCountMock.stockCounts[1].countDate).getTime();
      var thirdCountDate = new Date(stockCountMock.stockCounts[2].countDate).getTime();

      expect(firstCountDate).to.be.greaterThan(secondCountDate);
      expect(thirdCountDate).to.be.greaterThan(firstCountDate);

      var result = StockCountModel.sortByDate(stockCountMock.stockCounts);

      firstCountDate = new Date(result[0].countDate).getTime();
      secondCountDate = new Date(result[1].countDate).getTime();
      thirdCountDate = new Date(result[2].countDate).getTime();

      expect(firstCountDate).to.be.greaterThan(secondCountDate);
      expect(secondCountDate).to.be.greaterThan(thirdCountDate);
    });

    it('Sort by "created" in descending order if countDates are equal', function () {
      var stockCounts = [stockCountMock.stockCounts[0], stockCountMock.stockCounts[1]];
      var sc1 = stockCounts[0];
      var sc2 = stockCounts[1];
      //set to same count date
      sc1.countDate = '2016-09-22';
      sc2.countDate = '2016-09-22';

      var sc1Date = new Date(sc1.created).getTime();
      var sc2Date = new Date(sc2.created).getTime();

      expect(sc2Date).to.be.greaterThan(sc1Date);
      var result = StockCountModel.sortByDate(stockCounts);
      expect(result[0]).to.equal(sc2);
      expect(result[1]).to.equal(sc1);
    });
  });
});
