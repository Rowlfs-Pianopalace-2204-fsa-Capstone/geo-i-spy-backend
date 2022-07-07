/** @format */

const router = require('express').Router();
const { requireToken } = require('./gateKeepingMiddleware');
const { isAdmin } = require('./gateKeepingMiddleware');

const {
  models: { Challenge },
} = require('../db');
const User = require('../db/models/user');
const Achievements = require('../db/models/achievements');
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
    const challenge = await Challenge.create({
      name: req.body.name,
      difficulty: req.body.difficulty,
      score: req.body.score,
      description: req.body.description,
    });
    res.json(challenge);
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

router.put('/:id', requireToken, isAdmin, async (req, res, next) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    const updatedChallenge = await challenge.update({
      name: req.body.name,
      difficulty: req.body.difficulty,
      score: req.body.score,
      description: req.body.description,
    });
    res.send(updatedChallenge);
  } catch (err) {
    next(err);
  }
});
