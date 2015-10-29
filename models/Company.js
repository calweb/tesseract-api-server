var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
  name: String,
  logo: String,
  address: String,
  coords: {
    latitude: Number,
    longitude: Number
  },
  description: String,
  isActive: Boolean,
  gradsEmployed: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

var Company = mongoose.model('Company', companySchema);

module.exports = Company;
