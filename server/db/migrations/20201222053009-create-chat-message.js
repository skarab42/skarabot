const { Sequelize } = require("sequelize");
const tableFactory = require("../tableFactory");

const chatMessagesTable = tableFactory({
  time: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  viewerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
  }
});

module.exports = {
  up: async ({ context }) => {
    await context.createTable("ChatMessages", chatMessagesTable);
  }
};