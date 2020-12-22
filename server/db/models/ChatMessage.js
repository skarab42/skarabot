const { DataTypes } = require("sequelize");
const sequelize = require("../index");

const ChatMessage = sequelize.define("ChatMessage", {
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = ChatMessage;
