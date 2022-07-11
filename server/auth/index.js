/** @format */
const { requireToken } = require('../api/gateKeepingMiddleware');

const router = require('express').Router();
const {
  models: { User },
} = require('../db');
const Challenge = require('../db/models/challenges');
module.exports = router;

router.post('/login', async (req, res, next) => {
  try {
    res.send({
      token: await User.authenticate({
        username: req.body.username,
        password: req.body.password,
      }),
    });
  } catch (err) {
    next(err);
  }
});
router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.send({ token: await user.generateToken() });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists');
    } else {
      next(err);
    }
  }
});

router.get('/me', requireToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});
