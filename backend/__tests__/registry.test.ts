import { describe, expect, test } from "@jest/globals";
import Registry from "../src/service/registry.js";

describe("registry tests", () => {
  test("true branch", () => {
    const registry = new Registry();

    expect(registry.someFunc(true, "some_string")).toBe(true);
  });

  // explicitly not checking false branch for coverage
});
