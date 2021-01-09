const { addMessage, computeMessage } = require("../../../libs/chat");
const {
  addTeam,
  getTeamByName,
  getRanking,
} = require("../../../libs/teamRanking");

module.exports = async ({ message, client }, next) => {
  if (["!", "+", "-"].includes(message.message[0])) return next();

  const messageModel = await addMessage({
    viewerId: message.data.viewer.id,
    time: new Date(message.data.timestamp),
    message: computeMessage(message.emotes),
  });

  const team = message.data.team;

  if (team) {
    let teamRanking = await getTeamByName(team.name);

    if (!teamRanking) {
      teamRanking = await addTeam({
        team: team.name,
        messageCount: 1,
        totalMessageCount: 1,
      });
      client.io.emit("team.newRanking", teamRanking);
    } else {
      teamRanking.messageCount++;
      teamRanking.totalMessageCount++;
      await teamRanking.save();
    }

    client.io.emit("team.ranking", await getRanking());
  }

  client.io.emit("chat.new-message", {
    ...messageModel.get({ plain: true }),
    team,
  });

  next();
};
