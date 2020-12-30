"use strict";

const { Sequelize } = require("sequelize");
const tableFactory = require("../tableFactory");

const teamRankingTable = tableFactory({
  team: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  messageCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalMessageCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = {
  up: async ({ context }) => {
    await context.createTable("TeamRanking", teamRankingTable);
  },
};
