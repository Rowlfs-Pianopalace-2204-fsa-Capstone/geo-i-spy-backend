/** @format */

const router = require('express').Router();
const { requireToken } = require('./gateKeepingMiddleware');
const { isAdmin } = require('./gateKeepingMiddleware');

const {
  models: { User },
} = require('../db');
module.exports = router;

router.get('/', requireToken, async (req, res, next) => {
  try {
    const reponse = await User.findByPk(req.user.id, {
      include: [
        {
          model: User,
          as: 'followed',
          attributes: ['id', 'username', 'img_url'],
        },
      ],
    });
    res.send(reponse.followed);
  } catch (error) {
    next(error);
  }
});

router.get('/following', requireToken, async (req, res, next) => {
  try {
    const reponse = await User.findByPk(req.user.id, {
      include: [
        {
          model: User,
          as: 'followers',
          attributes: ['id', 'username', 'img_url'],
        },
      ],
    });
    res.send(reponse.followers);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const reponse = await User.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'followers',
          attributes: ['username', 'img_url'],
        },
      ],
    });
    res.send(reponse.followers);
  } catch (error) {
    next(error);
  }
});

router.post('/:id', requireToken, async (req, res, next) => {
  try {
    const user = req.user;
    await user.addFollowers(req.params.id);
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
      await user.removeFollowers(req.params.id);
    }
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});
