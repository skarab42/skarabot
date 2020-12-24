module.exports = async ({ message }, next) => {
  await message.data.viewer.save();

  next();
};
