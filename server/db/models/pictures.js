/** @format */

const Sequelize = require('sequelize');
const db = require('../db');

const Picture = db.define('picture', {
  img_url: {
    type: Sequelize.STRING,
    notNull: true,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Picture;
