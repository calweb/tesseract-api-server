var express = require('express');
var router = express.Router();
var ensureAuthenticated = require('./helpers').ensureAuthenticated;
var role = require('./roles');
var Card = require('../models/Card');

router.param('cardId', function (req, res, next, cardId) {
  next();
});

// api/cards
router.route('/cards')
  .all(ensureAuthenticated, role.can('access player resources'))
  .get(function (req, res, next) {
    Card.find({}, function (err, cards ) {
      if(err) return next(err);
      if(!cards) return res.status(404).send('Cards not found');
      res.status(200).send(cards);
    });
  })
  .post(function (req, res ) {
    Card.find({multiverse_id: req.body.multiverse_id}, function (err, card ) {
      if(card) return res.status(409).send({message: 'Sorry, card already exists!'});
  
      var newCard = new Card({
        name: req.body.name,
        types: req.body.types,
        colors: req.body.colors,
        cost: req.body.cost,
        text: req.body.text,
        cardSet: req.body.set,
        rarity: req.body.rarity,
        multiverse_id: req.body.multiverse_id,
        flavor: req.body.flavor,
        image_url: req.body.image_url
      });
      newCard.save(function (err) {
        res.status(200).send(newCard);
      });
    });
  });

  // api/cards/:cardId
  router.route('/cards/:cardId')
    .all(ensureAuthenticated, role.can('access player resources'))
    .get(function (req, res ) {
      Card.findById(req.params.cardId, function (err, card) {
        if(!card) return res.status(404).send({message: 'Sorry, card not found'});
        res.status(200).send(card);
      });
    })
    .delete(function (req, res, next ) {
      Card.findByIdAndRemove(req.params.cardId, function (err, card) {
        if(err) return next(err);
        res.status(200).send(card);
      });
    });
module.exports = router;
