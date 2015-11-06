var mongoose = require('mongoose');

var deckSchema = new mongoose.Schema({
  name: String,
  user: {type: mongoose.Schema.ObjectId, ref: 'User'},
  cards: [
    { type: mongoose.Schema.ObjectId, ref: 'Card'}
  ],
  description: String,
  isPublic: Boolean,
});

var Deck = mongoose.model('Deck', deckSchema);

module.exports = Deck;
