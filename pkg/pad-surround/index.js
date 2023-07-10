const leftPad = require("left-pad");

function reverse(str) {
  return str.split("").reverse().join("");
}

module.exports.padSurround = function padSurround(str, len, ch) {
  let delta = Math.max(len - str.length, 0);
  let withRightPad = reverse(
    leftPad(reverse(str), str.length + Math.floor(delta / 2), ch)
  );

  return leftPad(withRightPad, len, ch);
}
