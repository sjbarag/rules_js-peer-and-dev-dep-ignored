const { padSurround } = require("./");
const assert = require("assert");

assert.strictEqual(
  padSurround("foo", 5, "_"),
  "_foo_"
);
