"use strict";

module.exports = {
  up: async ({ context }) => {
    await context.removeColumn("Viewers", "team");
    await context.removeColumn("Viewers", "teamColor");
  },
};
