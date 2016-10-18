var expect = require('expect.js');
var productCategorySchema = require('./product_category.schema');
var Promise = require('bluebird');
var Joi = Promise.promisifyAll(require('joi'));

describe('Product Category: Create-Schema', function() {
  it('Should allow null value for parent', function (done) {
    var payload = {name: 'pc', parent: null, is_deleted: false};
    Joi.validateAsync(payload, productCategorySchema.createSchema)
      .then(function (result) {
        expect(result).to.eql(payload)
      })
      .finally(done);
  });

  it('Should set "is_deleted" default value (false if not given)', function (done) {
    var payload = {name: 'pc', parent: null};
    Joi.validateAsync(payload, productCategorySchema.createSchema)
      .then(function (result) {
        expect(result.is_deleted).to.equal(false)
      })
      .finally(done);
  });
});

var payload;
var payloadWithoutIsDeleted;

beforeEach(function() {
  payload = { _id: 'test-pc', _rev: 'test-pc-rev', created: '2016-10-30T12:00:23.000Z', name: 'pc', parent: null, is_deleted: false};
  payloadWithoutIsDeleted = { _id: 'test-pc', _rev: 'test-pc-rev', created: '2016-10-30T12:00:23.000Z', name: 'pc', parent: null};
});

describe('Product Category: Update-Schema', function() {
  it('Should allow null value for parent', function (done) {
    Joi.validateAsync(payload, productCategorySchema.updateSchema)
      .then(function (result) {
        result.created = result.created.toJSON();
        var expected = {
          _id: 'test-pc',
          _rev: 'test-pc-rev',
          created: '2016-10-30T12:00:23.000Z',
          name: 'pc',
          parent: null,
          is_deleted: false,
          doc_type: 'product-category',
          modified: null
        };
        expect(JSON.stringify(result)).to.equal(JSON.stringify(expected))
      })
      .finally(done);
  });

  it('Should set "is_deleted" default value (false if not given)', function (done) {
    expect(payloadWithoutIsDeleted.is_deleted).to.equal(undefined)
    Joi.validateAsync(payloadWithoutIsDeleted, productCategorySchema.updateSchema)
      .then(function (result) {
        expect(result.is_deleted).to.equal(false)
      })
      .finally(done);
  });
});
