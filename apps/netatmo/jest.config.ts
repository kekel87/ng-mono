/* eslint-disable */
export default {
  displayName: 'netatmo',
  preset: '../../jest.preset.js',
  globalSetup: '<rootDir>/src/global-test-setup.ts',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
    'ts-jest': {
  coverageDirectory: '../../coverage/apps/netatmo',
  collectCoverageFrom: ['./src/**'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
