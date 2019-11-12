import Main from "../../src/app/Main";

const { suite, test } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");

suite("Main", () => {
  const main = new Main();

  test("Instantiated", () => {
    assert.doesNotThrow(() => main);
  });
});
