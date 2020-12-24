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
  badges: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '{}',
    get() {
      return JSON.parse(this.getDataValue("badges"));
    },
    set(badges) {
      this.setDataValue("badges", JSON.stringify(badges));
    }
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
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '{"x":0,"y":0}',
    get() {
      return JSON.parse(this.getDataValue("position"));
    },
    set(position) {
      this.setDataValue("position", JSON.stringify(position));
    }
  },
  lastHighlight: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Viewer;
