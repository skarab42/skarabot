const viewers = [];

try {
  require.resolve('../../store/users')
  const users = require('../../libs/users')
  const baseURL = 'https://static-cdn.jtvnw.net/jtv_user_pictures/';

  Object.values(users.getAll()).forEach(user => {
    const avatarURL = user.avatarURL && user.avatarURL.replace(baseURL, '');

    viewers.push({
      userId: user.id,
      name: user.name,
      avatarURL,
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
