const { DataTypes } = require("sequelize");
const sequelize = require("../index");
const Viewer = require('./Viewer');

const ChatMessage = sequelize.define("ChatMessage", {
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  viewerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Viewer.hasMany(ChatMessage);
ChatMessage.belongsTo(Viewer);

module.exports = ChatMessage;
