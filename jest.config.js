export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  watchman: false,
  collectCoverageFrom: ["./src/*.ts"],
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        isolatedModules: true,
        tsconfig: "./tsconfig.json",
      },
    ],
  },
};
