const { greet } = require("./");
const assert = require("assert");

assert.strictEqual(
  greet("myspace-fan"),
  "Well hello there, xxmyspace-fanxx!"
);
