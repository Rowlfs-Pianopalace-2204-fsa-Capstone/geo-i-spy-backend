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
    // const messages = await User.findByPk(req.user.id, {
    //   include: {
    //     model: Room,
    //   },
    // });
    const rooms = await Room.findAll({
      include: {
        model: User,
      },
    });

    //Schema was built on the fly and not great so this is patchwork
    const userRooms = [];
    for (let i = 0; i < rooms.length; i++) {
      const ele = rooms[i].users;
      for (let j = 0; j < ele.length; j++) {
        const user = ele[j];
        if (parseInt(user.id) === parseInt(req.user.id)) {
          userRooms.push(rooms[i]);
        }
      }
    }

    res.json(userRooms);
  } catch (err) {
    next(err);
  }
});

router.post('/:id', requireToken, async (req, res, next) => {
  try {
    const room = await Room.create();
    const otherUser = User.findByPk(req.params.id);

    req.user.addRoom(room);
    otherUser.addRoom(room);

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireToken, async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id, {
      include: {
        model: Message,
      },
    });
    res.json(room);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id);
    room.destroy();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});
