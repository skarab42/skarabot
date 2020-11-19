module.exports = function random(min, max) {
  return Math.random() * (max - min) + min;
};
