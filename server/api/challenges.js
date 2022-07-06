/** @format */

const router = require('express').Router();
const { requireToken } = require('./gateKeepingMiddleware');
const { isAdmin } = require('./gateKeepingMiddleware');

const {
  models: { Challenge },
} = require('../db');
const User = require('../db/models/user');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const challenges = await Challenge.findAll();
    res.json(challenges);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, isAdmin, async (req, res, next) => {
  try {
    await Challenge.create({
      name: req.body.name,
      difficulty: req.body.difficulty,
      score: req.body.score,
      description: req.body.description,
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireToken, isAdmin, async (req, res, next) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    challenge.destroy();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.put('/', requireToken, isAdmin, async (req, res, next) => {
  try {
    const challenge = await Challenge.update({
      name: req.body.name,
      difficulty: req.body.difficulty,
      score: req.body.score,
      description: req.body.description,
    });
    res.send(challenge);
  } catch (err) {
    next(err);
  }
});

router.post('/complete', requireToken, async (req, res, next) => {
  try {
    const challenge = await Challenge.findByPk(req.body.id);
    const completedChallenge = await challenge.addUser(req.user.id);

    //We need to add the image to the through table, however I don't know yet how to store images from the phone onto the server so this line will have to change
    console.log(completedChallenge);
    const updated = await completedChallenge[0].update({
      img_url: req.body.img,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.get('/completed', requireToken, async (req, res, next) => {
  try {
    const challenge = Challenge.findByPk(req.body.id);
    const completedChallenge = await challenge.addUser(req.user.id);

    const img = req.body.img || '';
    //We need to add the image to the through table, however I don't know yet how to store images from the phone onto the server so this line will have to change
    const updated = await completedChallenge.update({ img_url: img });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});
