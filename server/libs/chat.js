const ChatMessage = require("../db/models/ChatMessage");

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
  return await ChatMessage.findOne({ where: { id }, include: "Viewer" });
}

async function getLastMessages({ limit = 10 } = {}) {
  const messages = await ChatMessage.findAll({
    include: "Viewer",
    limit,
    order: [["time", "DESC"]],
  });
  return messages.map((message) => message.toJSON());
}

module.exports = {
  addMessage,
  computeMessage,
  getLastMessages,
};
