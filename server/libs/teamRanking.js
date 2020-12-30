const TeamRanking = require("../db/models/TeamRanking");
const { Op } = require("sequelize");

async function addTeam(team) {
  return await TeamRanking.create(team);
}

async function getTeamByName(team) {
  return await TeamRanking.findOne({ where: { team } });
}

async function getRanking({ limit = 5, order = "DESC" } = {}) {
  return await TeamRanking.findAll({
    where: { messageCount: { [Op.gt]: 0 } },
    order: [["messageCount", order]],
    limit,
  });
}

async function resetRanking() {
  return await TeamRanking.update(
    {
      messageCount: 0,
    },
    {
      fields: ["messageCount"],
      where: { messageCount: { [Op.gt]: 0 } },
    }
  );
}

module.exports = {
  addTeam,
  getTeamByName,
  getRanking,
  resetRanking,
};
