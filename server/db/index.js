/** @format */

const db = require('./db');
const Achievements = require('./models/achievements');
const Challenge = require('./models/challenges');
const Followers = require('./models/Followers');
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
  as: 'followers',
  foreignKey: 'user_id',
  through: 'Followers',
});
User.belongsToMany(User, {
  as: 'followed',
  foreignKey: 'followed_id',
  through: 'Followers',
});

module.exports = {
  db,
  models: {
    Achievements,
    Followers,
    User,
    Picture,
    Challenge,
    Hint,
  },
};
