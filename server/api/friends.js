/** @format */

const router = require('express').Router();
const { requireToken } = require('./gateKeepingMiddleware');
const { isAdmin } = require('./gateKeepingMiddleware');

const {
  models: { User, Friends },
} = require('../db');
module.exports = router;

router.get('/', requireToken, async (req, res, next) => {
  try {
    const reponse = await User.findByPk(req.body.id, {
      include: [
        {
          model: User,
          as: 'friends',
        },
      ],
    });
    res.send(reponse);
  } catch (error) {
    next(error);
  }
});

router.post('/:id', requireToken, async (req, res, next) => {
  try {
    const user = req.user;
    await user.addFriends(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (user.id === req.params.id) {
      res.sendStatus(400);
    } else {
      await user.removeFriends(req.params.id);
    }
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});
