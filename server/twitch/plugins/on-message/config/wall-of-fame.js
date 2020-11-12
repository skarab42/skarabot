const screenSize = { width: 1920, height: 1080 };
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
