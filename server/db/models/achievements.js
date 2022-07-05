/** @format */

const Sequelize = require('sequelize');
const db = require('../db');

const Achievements = db.define('Achievement', {
  img_url: {
    type: Sequelize.STRING,
  },
});

module.exports = Achievements;
