/** @format */

const router = require('express').Router();
const { requireToken } = require('./gateKeepingMiddleware');
const { isAdmin } = require('./gateKeepingMiddleware');

const {
  models: { User },
} = require('../db');
module.exports = router;

router.get('/', requireToken, isAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username'],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/friends', requireToken, async (req, res, next) => {
  try {
    const reponse = await User.findByPk(req.user.id, {
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

router.post('/friend/:id', requireToken, async (req, res, next) => {
  try {
    const user = req.user;
    await user.addFriends(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.delete('/friend/:id', requireToken, async (req, res, next) => {
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
router.get('/:id', requireToken, isAdmin, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireToken, isAdmin, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    user.destroy();
    req.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireToken, isAdmin, async (req, res, next) => {
  try {
    const user = req.user;
    const updatedInformation = {
      username: req.body.username || user.username,
      img_url: req.body.img_url || user.img_url,
      email: req.body.email || user.email,
      score: parseInt(req.body.score) || user.score,
      biography: req.body.biography || user.biography,
    };
    await user.update(updatedInformation);
    res.json(user);
  } catch (error) {
    next(error);
  }
});
