const { DataTypes } = require("sequelize");
const sequelize = require("../index");

const Viewer = sequelize.define("Viewer", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  avatarURL: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Viewer;
