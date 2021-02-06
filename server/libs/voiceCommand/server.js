/* eslint-disable no-console */
const { vr } = require("voice-recognition");
const path = require("path");

const recognizer = new vr("fr-FR");

recognizer.continuos = true;
recognizer.sameThread = false;

recognizer.add_grammar_from_xml(
  path.join(__dirname, "grammar.xml"),
  "skarabot"
);

recognizer.on("vc:recognized", (result) => {
  process.send
    ? process.send(result)
    : console.log(result.Confidence, result.Text);
});

recognizer.listen();
