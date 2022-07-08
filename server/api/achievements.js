/** @format */

const router = require('express').Router();
const { requireToken } = require('./gateKeepingMiddleware');
const { isAdmin } = require('./gateKeepingMiddleware');
const multer = require('multer');
const {
  models: { Challenge },
} = require('../db');
const User = require('../db/models/user');
const Achievements = require('../db/models/achievements');
const uploadPicture = require('./cloudinary');
const cloudinary = require('cloudinary').v2;
module.exports = router;

router.get('/', requireToken, async (req, res, next) => {
  try {
    const achievements = await Achievements.findAll({
      where: {
        userId: req.user.id,
      },
    });

    res.send(achievements);
  } catch (err) {
    next(err);
  }
});

router.post('/id', async (req, res, next) => {
  try {
    cloudinary.config({
      cloud_name: 'hckemznha',
      api_key: '756524156741189',
      api_secret: 'IbgjGuRQjJDLAuEr1hum7VzCedM',
    });
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr);
    console.log(uploadResponse);
    res.json({ msg: 'Worked!' });

    const challenge = await Challenge.findByPk(req.params.id);
    const completedChallenge = await challenge.addUser(req.user.id);
    //
    const updated = await completedChallenge[0].update({
      img_url: uploadResponse.url,
    });

    res.json({ updated, uploadResponse });
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
