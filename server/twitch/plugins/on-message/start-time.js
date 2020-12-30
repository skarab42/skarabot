const { getStartTime } = require("./../../../libs/stream");

module.exports = async ({ message }, next) => {
  message.data.startTime = getStartTime();
  return next();
};
