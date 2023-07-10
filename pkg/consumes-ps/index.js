const { padSurround } = require("pad-surround");

module.exports.greet = function greet(name) {
  return `Well hello there, ${padSurround(name, name.length + 4, "x")}!`;
}
