const ChatMessage = require("../db/models/ChatMessage");
const Viewer = require("../db/models/Viewer");

async function addMessage(message) {
  const messageModel = await ChatMessage.create(message);
  return getMessageById(messageModel.id);
}

function computeMessage(emotes) {
  return emotes
    .map((emote) => {
      if (emote.type === "emote") {
        return `[:emote|${emote.id}|${emote.name}]`;
      }
      return emote.text;
    })
    .join("");
}

async function getMessageById(id) {
  return await ChatMessage.findOne({
    where: { id },
    include: [{ model: Viewer, as: "viewer" }],
  });
}

async function getLastMessages({ limit = 10 } = {}) {
  const messages = await ChatMessage.findAll({
    include: [{ model: Viewer, as: "viewer" }],
    order: [["time", "DESC"]],
    limit,
  });
  // const userIds = [];
  return messages.map((message) => message.toJSON());
}

module.exports = {
  addMessage,
  computeMessage,
  getLastMessages,
};
