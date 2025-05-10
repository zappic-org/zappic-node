/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@clients/(.*)$': '<rootDir>/src/clients/$1',
  },
  setupFiles: [ 'dotenv/config' ],
};

