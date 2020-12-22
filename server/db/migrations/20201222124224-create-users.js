const { Sequelize } = require("sequelize");
const tableFactory = require("../tableFactory");

const viewersTable = tableFactory({
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  avatarURL: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

module.exports = {
  up: async ({ context }) => {
    await context.createTable("Viewers", viewersTable);
  }
};
