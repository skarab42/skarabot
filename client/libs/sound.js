function playSound({ file, volume = 0.5 } = {}) {
  const audio = new Audio(`download/${file}`);
  audio.volume = volume;
  audio.play();
}

module.exports = {
  playSound,
};
