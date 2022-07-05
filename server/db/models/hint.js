/** @format */

const Sequelize = require('sequelize');
const db = require('../db');

const Hint = db.define('hint', {
  hint: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Hint;
