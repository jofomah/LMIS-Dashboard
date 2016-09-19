function(doc) {
  if (doc && doc.doc_type === 'stock-count') {
    emit([doc.programId, new Date(doc.countDate).getTime(), doc.facilityId], {_id: doc._id})
  }
}
