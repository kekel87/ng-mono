const nxPreset = require('@nx/jest/preset').default;
const { resolve } = require('path');

// See https://github.com/jestjs/jest/issues/13576
const coverageConfig = {
  collectCoverage: true,
  coverageReporters: !process.env.CI ? ['lcov', 'text-summary']: ['text-summary'],
};

module.exports = { ...nxPreset, ...coverageConfig };
