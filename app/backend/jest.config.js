/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  rootDir: "./",
  collectCoverage:true,
  coverageReporters:["html"],
  modulePaths: [
      "<rootDir>"
  ],
  collectCoverageFrom: [
    "<rootDir>/**/*.ts",
    "!<rootDir>/**/node_modules/**"
  ],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  }
};