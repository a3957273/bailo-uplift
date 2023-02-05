import { describe, expect, test } from "@jest/globals";
import config from "../src/utils/config.js";

describe("basic tests", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(1 + 2).toBe(3);
  });

  test("config port set", () => {
    expect(config.server.port).toBe(3006);
  });
});
