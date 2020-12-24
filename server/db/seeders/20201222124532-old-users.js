const viewers = [];

try {
  require.resolve('../../store/users')
  const users = require('../../libs/users')
  const baseURL = 'https://static-cdn.jtvnw.net/jtv_user_pictures/';

  Object.values(users.getAll()).forEach(user => {
    const avatarURL = user.avatarURL && user.avatarURL.replace(baseURL, '');

    viewers.push({
      id: parseInt(user.id),
      name: user.name,
      avatarURL,
      badges: "{}",
      messageCount: parseInt(user.messageCount),
      viewCount: parseInt(user.viewCount),
      points: parseInt(user.points),
      position: JSON.stringify({
        x: parseInt(user.position.x),
        y: parseInt(user.position.y)
      }),
      lastHighlight: new Date(user.lastHighlight),
      createdAt: new Date(user.firstSeen),
      updatedAt: new Date(user.lastSeen)
    });
  });
} catch (error) {
  // console.log(">>> ERROR >>>", error.message);
}

module.exports = {
  up: async ({ context }) => {
    await context.bulkInsert('Viewers', viewers);
  },
};
