var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
  name: String,
  description: String,
  grads: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

var Course = mongoose.model('Course', courseSchema);

module.exports = Course;
