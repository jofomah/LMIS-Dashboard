'use strict';

exports.VIEWS = {
  byDocTypes: 'doctypes/by-type',
  stockCountByProgramCountDateAndFacility: 'stockcount/by_program_countdate_facility',
  facilityByLocation: 'facility/by_location',
  productProfileById: 'productprofile/by_id',
  programProductProfilesByFacilityAndProgram: 'facility_program_product_profile/by_facility_and_program',
  adminLevelByFacility: 'facility/by_id'
};

exports.DOC_TYPES = {
  facilityProgramProductProfile : 'facility-program-product-profile',
  productType: 'product-type',
  stockCount: 'stock-count',
  productCategory: 'product-category'
}
