module.exports = ({ message }, next) => {
  message.data.timestamp = Date.now();
  next();
};
