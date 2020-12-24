const { Sequelize } = require("sequelize");
const tableFactory = require("../tableFactory");

const viewersTable = tableFactory({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  avatarURL: {
    type: Sequelize.STRING,
    allowNull: true
  },
  badges: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '{}',
  },
  messageCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  viewCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  position: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '{"x":0,"y":0}'
  },
  lastHighlight: {
    type: Sequelize.DATE,
    allowNull: true
  }
});

module.exports = {
  up: async ({ context }) => {
    await context.createTable("Viewers", viewersTable);
  }
};
