var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Deck = require('../models/Deck');
var config = require('../config');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;
var role = require('./roles');

// GET /api/me
router.route('/me')
  .all(ensureAuthenticated)
  .get(function(req, res) {
    User.findById(req.user, function(err, user) {
      res.send(user);
    });
  })
// PUT /api/me
  .put(function(req, res) {
    User.findById(req.user, function(err, user) {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      user.displayName = req.body.displayName || user.displayName;
      user.email = req.body.email || user.email;
      user.save(function(err) {
        res.status(200).end();
      });
    });
  });

router.param('userId', function (req, res, next, userId) {
  next();
});

// admin
router.route('/admin/users')
  .all(ensureAuthenticated, role.can('access all the things'))
  .get(function (req, res) {
    User.find({}, function (err, users) {
      if (err) { return res.status(400).send({ message: 'Users not found' }); }

      res.status(200).send(users);
    });
  });
router.route('/admin/users/:userId')
  .all(ensureAuthenticated, role.can('access all the things'))
  .get(function (req, res) {
    User.findById(req.params.userId, function (err, user) {
      if (!user) { return res.status(400).send({ message: 'User not found' }); }
      res.status(200).send(user);
    });
  })
  .put(function (req, res) {
    User.findById(req.params.userId, function (err, user) {
      if (!user) { return res.status(400).send({ message: 'User not found' }); }
      user.displayName = req.body.displayName || user.displayName;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.save(function(err) {
        res.status(200).end();
      });
    });
  })
  .delete(function (req, res) {
    User.findByIdAndRemove(req.params.userId, function (err, user) {
      if(err) { return next(err); }
      res.status(200).send({message: 'Successfuly Deleted User'});
    });
  });

  // deckbuilding
  router.param('deckId', function (req, res, next, deckId) {
    next();
  });

  router.route('/me/decks')
    .all(ensureAuthenticated, role.can('access player resources'))
    .get(function (req, res) {
      Deck.find({user: req.user }, function (err, decks) {
        if (err) { return res.status(400).send({ message: 'Decks not found' }); }
        res.status(200).send(decks);
      });
    })
    .post(function (req, res) {
      var deck = new Deck({
        name: req.body.name,
        user: req.user,
        cards: req.body.cards,
        description: req.body.description,
        isPublic: req.body.isPublic || false
      });

      deck.save(function () {
        res.send(deck);
      });

    });

  router.route('/me/decks/:deckId')
    .all(ensureAuthenticated, role.can('access player resources'))
    .get(function (req, res ) {
      Deck.findById(req.params.deckId, function (err, deck ) {
        if(err) return res.status(400).send(err);
        res.status(200).send(deck);
      });
    })
    .put(function (req, res ) {
      Deck.findById(req.params.deckId, function (err, deck ) {
        if(err) return res.status(400).send(err);
        if(!deck) return res.status(404).send({message: 'Deck not found!'});
        deck.name = req.body.name || deck.name;
        deck.user = req.body.user || deck.user;
        deck.cards = req.body.cards || deck.cards;
        deck.description = req.body.description || deck.description;
        deck.isPublic = req.body.isPublic || deck.isPublic;

        deck.save(function () {
          res.status(200).end();
        });

      });
    });

module.exports = router;
