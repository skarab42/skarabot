const screenSize = { width: 2620, height: 1440 };
const imgSize = { width: 100, height: 100 };
const screenLimit = {
  x: screenSize.width - imgSize.width,
  y: screenSize.height - imgSize.height,
};

module.exports = {
  screenSize,
  imgSize,
  screenLimit,
};
