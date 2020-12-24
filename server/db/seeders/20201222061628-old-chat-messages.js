"use strict";

const { computeMessage } = require("../../libs/chat");

const chatMessages = [];

try {
  require.resolve("../../store/logs");
  const logs = require("../../libs/logs");
  const now = new Date();

  logs.getAll().forEach(({ time, data }) => {
    chatMessages.push({
      viewerId: parseInt(data.userId),
      time: new Date(time),
      message: computeMessage(data.emotes),
      createdAt: now,
      updatedAt: now,
    });
  });
} catch (error) {
  // console.log(">>> ERROR >>>", error.message);
}

module.exports = {
  up: async ({ context }) => {
    await context.bulkInsert("ChatMessages", chatMessages);
  },
};
