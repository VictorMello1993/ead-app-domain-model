/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.spec.ts"],
  moduleNameMapper: {
    "^@/tests/(.*)": "<rootDir>/tests/$1",
    "^@/(.*)$": "<rootDir>/src/$1"
  }
  // setupFiles: ["<rootDir>/tests/.env.ts"]
};
