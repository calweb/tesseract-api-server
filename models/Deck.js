var mongoose = require('mongoose');

var deckSchema = new mongoose.Schema({
  name: String,
  user: {type: mongoose.Schema.ObjectId, ref: 'User'},
  cards: [
    {
      card: { type: mongoose.Schema.ObjectId, ref: 'Card'},
      qty: Number
    }

  ],
  description: String,
  isPublic: Boolean,
});

var Deck = mongoose.model('Deck', deckSchema);

module.exports = Deck;
