/** @format */

const Sequelize = require('sequelize');
const db = require('../db');

const Message = db.define('message', {
  message: {
    type: Sequelize.TEXT,
    validator: {
      allowNull: false,
      NotEmpty: true,
    },
  },
});

module.exports = Message;
