const { getRanking, resetRanking } = require("../../../../libs/teamRanking");

module.exports = async ({ client, isModo }) => {
  if (!isModo()) return;

  await resetRanking();

  client.io.emit("team.ranking", await getRanking());
};
