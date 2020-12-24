const { Sequelize } = require("sequelize");

function tableFactory(table) {
  return {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ...table,
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  };
}

module.exports = tableFactory;
