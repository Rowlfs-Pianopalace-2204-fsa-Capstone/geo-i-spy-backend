/** @format */

const db = require('./db');
const Achievements = require('./models/achievements');
const Challenge = require('./models/challenges');
const Friends = require('./models/friends');
const Hint = require('./models/hint');
const Picture = require('./models/pictures');
const User = require('./models/user');

Challenge.hasMany(Hint);
Hint.belongsTo(Challenge);

Challenge.hasMany(Picture);
Picture.belongsTo(Challenge);

Challenge.belongsToMany(User, { through: Achievements });
User.belongsToMany(Challenge, { through: Achievements });

User.belongsToMany(User, {
  as: 'friends',
  foreignKey: 'user_id',
  through: Friends,
});
User.belongsToMany(User, {
  as: 'userFriends',
  foreignKey: 'friend_id',
  through: Friends,
});

module.exports = {
  db,
  models: {
    Achievements,
    Friends,
    User,
    Picture,
    Challenge,
    Hint,
  },
};
