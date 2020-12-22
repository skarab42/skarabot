const { DataTypes } = require("sequelize");
const sequelize = require("../index");

const Viewer = sequelize.define("Viewer", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  avatarURL: {
    type: DataTypes.STRING,
    allowNull: true
  },
  messageCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  viewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  lastHighlight: {
    type: DataTypes.DATE,
    allowNull: true
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '{"x":0,"y":0}'
  }
});

module.exports = Viewer;
