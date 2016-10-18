function (doc) {
  if (doc.doc_type === 'facility-program-product') {
    var key = [doc.facilityId, doc.programId];
    // emit main doc and nested docs
    emit(key, { _id: doc._id });
    emit(key, { _id: doc.facilityId, type: 'facility' });
    emit(key, { _id: doc.programId, type: 'program'});
    emit(key, { _id: doc.productTypeId, type: 'product-type' });
  }
}
