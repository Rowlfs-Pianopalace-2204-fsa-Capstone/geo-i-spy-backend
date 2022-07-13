/** @format */
const { Op } = require('sequelize');

const router = require('express').Router();
const { requireToken } = require('./gateKeepingMiddleware');
const { isAdmin } = require('./gateKeepingMiddleware');
const multer = require('multer');
const {
  models: { Challenge },
} = require('../db');
const User = require('../db/models/user');
const Achievements = require('../db/models/achievements');
const e = require('express');
const cloudinary = require('cloudinary').v2;
module.exports = router;

router.get('/feed', requireToken, async (req, res, next) => {
  try {
    const reponse = await User.findByPk(req.user.id, {
      attributes: ['id'],
      include: [
        {
          model: User,
          as: 'followers',
          attributes: ['id', 'username', 'img_url'],
          include: {
            model: Challenge,
          },
        },
      ],
    });
    const allFollowingAchievements = [];
    let i = 0;
    while (reponse.followers.length > i) {
      if (reponse.followers[0].challenges[0]) {
        const temp = {
          challenge: reponse.followers[0].challenges[0],
          username: reponse.followers[0].username,
          id: reponse.followers[0].id,
          img: reponse.followers[0].img_url,
        };
        allFollowingAchievements.push(temp);
        reponse.followers[0].challenges.shift();
      } else {
        reponse.followers.shift();
      }
    }
    allFollowingAchievements.sort(function (x, y) {
      return (
        new Date(x.challenge.Achievement.createAt) -
        new Date(y.challenge.Achievement.creatAT)
      );
    });
    res.send(allFollowingAchievements);
  } catch (err) {
    next(err);
  }
});

router.get('/', requireToken, async (req, res, next) => {
  try {
    const achievements = await Challenge.findAll({
      include: {
        model: User,
        where: {
          id: req.user.id,
        },
        attributes: ['id'],
      },
    });
    const challenges = await Challenge.findAll();
    for (let i = 0; i < challenges.length; i++) {
      if (!(await challenges[i].hasUser(req.user.id))) {
        achievements.push(challenges[i]);
      }
    }

    res.send(achievements);
  } catch (err) {
    next(err);
  }
});

router.post('/:id', requireToken, async (req, res, next) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRETS,
    });
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr);

    let challenge = await Challenge.findByPk(req.params.id, {
      include: {
        model: User,
        where: {
          id: req.user.id,
        },
      },
    });
    if (!challenge) {
      challenge = await Challenge.findByPk(req.params.id);
    }
    const completedChallenge = await challenge.addUser(req.user.id);
    //
    if (completedChallenge) {
      await completedChallenge[0].update({
        img_url: uploadResponse.url,
      });
      req.user.update({
        score: req.user.score + challenge.score,
      });
    } else {
      if (challenge.weeklyChallenge && req.user.dailyToken === 1) {
        req.user.update({
          dailyToken: 0,
          score: req.user.score + challenge.score,
        });
      }
      const updatePicture = challenge.users[0].Achievement;
      updatePicture.update({ img_url: uploadResponse.url });
    }

    const fullAchievementObj = await Challenge.findByPk(req.params.id, {
      include: {
        model: User,
        where: {
          id: req.user.id,
        },
        attributes: ['id'],
      },
    });

    res.send(fullAchievementObj);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const achievement = await Challenge.findByPk(req.params.id, {
      include: {
        model: User,
        where: {
          id: req.user.id,
        },
        attributes: ['id'],
      },
    });
    res.send(achievement);
  } catch (err) {
    next(err);
  }
});

router.delete('/', requireToken, isAdmin, async (req, res, next) => {
  try {
    const challenge = await Challenge.findByPk(req.body.challengeId);
    await challenge.removeUser(req.body.userId);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});
