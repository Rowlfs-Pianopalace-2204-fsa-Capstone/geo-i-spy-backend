/** @format */

const Message = require('./db/models/messages');
const Room = require('./db/models/rooms');
const User = require('./db/models/user');

const getMessage = async (id) => {
  const room = await Room.findByPk(id, {
    include: {
      model: Message,
      include: {
        model: User,
        attributes: ['id', 'username', 'img_url'],
      },
    },
  });
  return room;
};

module.exports = getMessage;
