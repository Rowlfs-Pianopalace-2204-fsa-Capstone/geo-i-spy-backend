/** @format */

const db = require('./db');
const Achievements = require('./models/achievements');
const Challenge = require('./models/challenges');
const Followers = require('./models/followers');
const Hint = require('./models/hint');
const Picture = require('./models/pictures');
const Room = require('./models/rooms');
const User = require('./models/user');
const Message = require('./models/messages');

Challenge.hasMany(Hint);
Hint.belongsTo(Challenge);

Challenge.hasMany(Picture);
Picture.belongsTo(Challenge);

Challenge.belongsToMany(User, { through: Achievements });
User.belongsToMany(Challenge, { through: Achievements });

User.belongsToMany(User, {
  as: 'followers',
  foreignKey: 'user_id',
  through: 'Followers',
});
User.belongsToMany(User, {
  as: 'followed',
  foreignKey: 'followed_id',
  through: 'Followers',
});

User.belongsToMany(Room, { through: 'Rooms' });
Room.belongsToMany(User, { through: 'Rooms' });

Message.belongsTo(User);
User.hasMany(Message);

Message.belongsTo(Room);
Room.hasMany(Message);

// Room.belongsTo(User);
// User.hasMany(Room);

module.exports = {
  db,
  models: {
    Achievements,
    Followers,
    User,
    Picture,
    Challenge,
    Hint,
    Room,
    Message,
  },
};
