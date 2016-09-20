function(doc) {
  if (doc && doc.doc_type === 'facility' && doc.location) {
    var ancestor;
    var value = {
      _id: doc._id,
      name: doc.name
    };
    for (var i in doc.location.ancestors) {
      ancestor = doc.location.ancestors[i];
      emit(ancestor._id, value);
    }
  }
}
