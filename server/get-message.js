/** @format */

const Message = require('./db/models/messages');
const Room = require('./db/models/rooms');
const User = require('./db/models/user');

const getMessage = async (id) => {
  const message = await Message.findByPk(id, {
    include: [
      { model: User, attributes: ['id', 'username', 'img_url'] },
      { model: Room },
    ],
  });
  return message;
};

module.exports = getMessage;
