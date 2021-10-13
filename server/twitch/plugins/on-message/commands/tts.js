const textToSpeech = require("@google-cloud/text-to-speech");
const { play } = require("sound-play");
const util = require("util");
const path = require("path");
const fs = require("fs");

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
  __dirname,
  "tts-keys/skara-bot-c57fd9129493.json"
);

const volume = 5;
const messages = [];
let isPlaying = false;
const client = new textToSpeech.TextToSpeechClient();
const mp3File = path.join(__dirname, "tts-output/output.mp3");

async function say() {
  if (isPlaying || messages.length === 0) return;

  isPlaying = true;

  const { user, text } = messages.shift();

  const request = {
    input: { text: `${user} dit "${text}"` },
    voice: { languageCode: "fr-FR", ssmlGender: "FEMALE" },
    audioConfig: {
      volumeGainDb: 16,
      audioEncoding: "MP3",
      effectsProfileId: ["large-home-entertainment-class-device"],
    },
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);

  await writeFile(mp3File, response.audioContent, "binary");
  await play(mp3File, volume);

  isPlaying = false;
  say();
}

module.exports = (user, text) => {
  messages.push({ user, text });

  say();
};
