/** @format */

const Sequelize = require("sequelize");
const db = require("../db");

const Friends = db.define("friend", {
  friendId: Sequelize.INTEGER,
  // allowNull: false,
});

module.exports = Friends;
