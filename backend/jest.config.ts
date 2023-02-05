import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  //   preset: 'ts-jest/presets/default-esm',
  testEnvironment: "node",
  verbose: true,
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  coverageProvider: "v8",
  resolver: "jest-ts-webcompat-resolver",
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
export default config;
