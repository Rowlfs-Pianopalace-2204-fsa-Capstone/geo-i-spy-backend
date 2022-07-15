/** @format */

const router = require('express').Router();
const { requireToken } = require('./gateKeepingMiddleware');
const { isAdmin } = require('./gateKeepingMiddleware');

const {
  models: { User, Room, Message, Rooms },
} = require('../db');
module.exports = router;

router.get('/', requireToken, async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      where: { userId: req.user.id },
    });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.post('/:id', requireToken, async (req, res, next) => {
  try {
    const message = await Message.create({ message: req.body.message });
    req.user.addMessage(message);
    const room = await Room.findByPk(req.params.id);
    room.addMessage(message);
    res.json(message);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    await Message.destroy({ where: { id: req.params.id } });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireToken, async (req, res, next) => {
  try {
    const message = await Message.findByPk(req.params.id);
    await message.update({ message: req.body.message });
    res.send(message);
  } catch (err) {
    next(err);
  }
});
