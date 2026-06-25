/** @type {import('jest').Config} */
module.exports = {
  // TypeScript files via ts-jest
  preset: "ts-jest",
  testEnvironment: "node",

  // Match both JS and TS solution test files
  testMatch: [
    "**/solutions/**/*.test.ts",
    "**/solutions/**/*.test.js",
    "**/tests/**/*.test.ts",
    "**/tests/**/*.test.js",
  ],

  // Map TS paths (mirrors tsconfig paths)
  moduleNameMapper: {
    "^@utils/(.*)$": "<rootDir>/solutions/utils/$1",
  },

  // ts-jest settings
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },

  // Show individual test names
  verbose: true,

  // Coverage (run: jest --coverage)
  collectCoverageFrom: ["solutions/**/*.{js,ts}", "!solutions/**/*.test.*"],
};
