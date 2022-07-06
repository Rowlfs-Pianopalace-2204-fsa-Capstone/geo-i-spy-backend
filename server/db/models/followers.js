/** @format */

const Sequelize = require('sequelize');
const db = require('../db');

const Followers = db.define('follower', {
  follower_Id: Sequelize.INTEGER,
  // allowNull: false,
});

module.exports = Followers;
