function (doc) {
  if (doc.doc_type === 'stock-count') {
    emit(doc._id)
  }
}
