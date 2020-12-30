const { getRanking, resetRanking } = require("../../../../libs/teamRanking");

module.exports = async ({ message, client }) => {
  const viewer = message.data.viewer;
  const badges = viewer.badges;
  const sudo = badges.broadcaster || badges.moderator;

  if (!sudo) {
    client.chat.say(
      message.channel,
      `Usage: pas pour toi ${viewer.name} Kappa`
    );
    return;
  }

  await resetRanking();

  client.io.emit("team.ranking", await getRanking());
};
