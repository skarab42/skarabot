const { Sequelize } = require("sequelize");
const { db } = require("../config");

module.exports = new Sequelize(db);
