/** @format */

const router = require('express').Router();
const { requireToken } = require('./gateKeepingMiddleware');
const { isAdmin } = require('./gateKeepingMiddleware');

const {
  models: { User },
} = require('../db');
const e = require('express');
module.exports = router;

router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const reponse = await User.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'followed',
          attributes: [
            'id',
            'username',
            'img_url',
            'biography',
            'score',
            'email',
          ],
        },
      ],
    });
    if (reponse) {
      res.send(reponse.followed);
    } else {
      reponse.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

router.get('/following/:id', requireToken, async (req, res, next) => {
  try {
    const reponse = await User.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'followers',
          attributes: [
            'id',
            'username',
            'img_url',
            'biography',
            'score',
            'email',
          ],
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

router.get('/search/:id', async (req, res, next) => {
  try {
    let searched = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'img_url', 'biography', 'score', 'email'],
    });
    res.send(searched);
  } catch (error) {
    next(error);
  }
});
