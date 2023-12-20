/* eslint-disable */
export default {
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['../../jest-setup.angular.ts'],
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
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  collectCoverageFrom: ['./src/**'],
  coveragePathIgnorePatterns: [
    'index.html',
    'main.ts',
    'index.ts',
    'app.config.ts',
    '.*.routes.ts',
  ],
};
