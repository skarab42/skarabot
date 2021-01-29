const { vr } = require("voice-recognition");
const path = require("path");

const recognizer = new vr("fr-FR");

recognizer.add_grammar_from_xml(
  path.join(__dirname, "grammar.xml"),
  "skarabot"
);

recognizer.on("vc:recognized", (result) => {
  process.send(result);
});

recognizer.listen();
