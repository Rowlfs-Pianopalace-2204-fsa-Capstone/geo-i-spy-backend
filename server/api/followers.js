/** @format */

const router = require('express').Router();
const { requireToken } = require('./gateKeepingMiddleware');
const { isAdmin } = require('./gateKeepingMiddleware');

const {
  models: { User },
} = require('../db');
const e = require('express');
const { Op, Sequelize } = require('sequelize');
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
    if (parseInt(user.id) === parseInt(req.params.id)) {
      res.sendStatus(400);
    }
    await user.addFollowers(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    const user = req.user;
    if (parseInt(user.id) === parseInt(req.params.id)) {
      res.sendStatus(400);
    } else {
      await user.removeFollowers(req.params.id);
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
});

router.get('/search/:id', requireToken, async (req, res, next) => {
  try {
    let userList = [];
    if (parseInt(req.params.id)) {
      let searched = await User.findByPk(req.params.id, {
        attributes: [
          'id',
          'username',
          'img_url',
          'biography',
          'score',
          'email',
        ],
      });
      userList.push(searched);
    }

    const term = '%' + req.params.id + '%';

    const users = await User.findAll({
      attributes: ['id', 'username', 'img_url', 'biography', 'score', 'email'],
      where: {
        username: {
          [Sequelize.Op.iLike]: term,
        },
      },
    });
    userList = [...userList, ...users];
    userList = userList.filter((e) => e.username !== req.user.username);

    res.send(userList);
  } catch (error) {
    next(error);
  }
});
