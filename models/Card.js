var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
  name: String,
  types: [ String ],
  subtypes: [ String ],
  colors: [ String ],
  cost: String,
  text: String,
  cardSet: String,
  rarity: String,
  multiverse_id: Number,
  flavor: String,
  image_url: String
});

var Card = mongoose.model('Card', cardSchema);

module.exports = Card;
