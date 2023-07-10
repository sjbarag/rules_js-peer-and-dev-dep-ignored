const { greet } = require("./");

describe("greet", () => {
  it("works", () => {
    expect(greet("myspace-fan")).toEqual("Well hello there, xxmyspace-fanxx!");
  })
});
