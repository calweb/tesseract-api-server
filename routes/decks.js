var express = require('express');
var router = express.Router();
var ensureAuthenticated = require('./helpers').ensureAuthenticated;
var role = require('./roles');
var Deck = require('../models/Deck');
var Card = require('../models/Card');
var _ = require('lodash');

router.param('deckId', function (req, res, next, cardId) {
  next();
});

// logged user deck routes

// api/me/decks
router.route('/me/decks')
  .all(ensureAuthenticated, role.can('access player resources'))
  .get(function (req, res, next) {
    Deck.find({ user: req.user }, function (err, decks ) {
      if(err) return next(err);
      if(!decks) return res.status(404).send('Decks not found');
      res.status(200).send(decks);
    });
  })
  .post(function (req, res ) {
    Deck.findOne({name: req.body.name}, function (err, deck ) {
      console.log('card',deck);
      if(deck) return res.status(409).send({message: 'Sorry, Deck with name: '+ req.body.name +' already exists'});

      var newDeck = new Deck({
        name: req.body.name,
        user: req.user,
        description: req.body.description,
        cards: req.body.cards,
        isPublic: false // default to not public upon initial save.
      });
      newDeck.save(function (err) {
        res.status(200).send(newDeck);
      });
    });
  });

  router.route('/me/decks/:deckId')
    .get(function (req, res, next) {
      Deck.findById(req.params.deckId, function (err, deck) {
        if(!deck) return res.status(404).send({message: 'Sorry, deck not found'});
      })
    })
    .put(function (req, res, next) {
      Deck.find({user: req.user}, function (err, decks) {
        if(err) return next(err);
        var meDeck = _.find(decks, ['_id', req.params.deckId ]);

        meDeck.name = req.body.name || meDeck.name,
        meDeck.user = meDeck.user,
        meDeck.description = req.body.description || meDeck.description,
        meDeck.cards = req.body.cards || meDeck.cards,
        meDeck.isPublic = req.body.isPublic || meDeck.isPublic
        meDeck.save(function () {
          res.status(200).send(meDeck);
        })

      });
    })
    .delete(function (req, res, next ) {
      Deck.findByIdAndRemove(req.params.deckId, function (err, deck) {
        if(err) return next(err);
        res.status(200).end();
      });
    });

// authenticatd users can browse public decks
  // api/decks
  router.route('/decks')
    .get(ensureAuthenticated, role.can('access player resources'), function (req, res) {
      Deck.find({}, function (err, decks) {
        if(err) return res.status(404).send({message: 'Sorry, there are no decks or they cannot be found.'});
        var publicDecks = _.filter(decks, function (item) {
          return item.isPublic;
        });
        res.status(200).send(publicDecks);
      })
    });
  // api/decks/:deckId
  router.route('/decks/:deckId')
    .all(ensureAuthenticated, role.can('access player resources'))
    .get(function (req, res ) {
      Deck.findById(req.params.deckId, function (err, deck) {
        if(!deck) return res.status(404).send({message: 'Sorry, deck not found'});
        if(!deck.isPublic) res.status(401).send({message: 'Sorry,deck not found'});
        res.status(200).send(deck);
      });
    })

module.exports = router;
