const { DataTypes } = require("sequelize");
const sequelize = require("../index");

const TeamRanking = sequelize.define(
  "TeamRanking",
  {
    team: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messageCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalMessageCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = TeamRanking;
