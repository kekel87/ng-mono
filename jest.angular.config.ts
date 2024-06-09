import { relative, join } from 'path';
import type { Config } from 'jest';

const jestAngularConfig = (props: { projectDir: string, coverageThreshold?: Config['coverageThreshold'] }): Config => {
  const upPath = relative(props.projectDir, __dirname);
  const project = require(join(props.projectDir, "project.json"));


  return {
    displayName: project.name,
    passWithNoTests: true,
    preset: join(upPath, 'jest.preset.js'),
    setupFilesAfterEnv: [join(upPath, 'jest-setup.angular.ts')],
    cache: true,
    cacheDirectory: join(upPath, ".cache/jest", project.name),
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
    // See jest.preset.js
    // collectCoverage: true,
    // coverageReporters: ['lcov', 'text-summary'],
    collectCoverageFrom: [`./src/**`],
    coverageDirectory: join(upPath, "coverage", project.name),
    coveragePathIgnorePatterns: [
      'index.html',
      'main.ts',
      'index.ts',
      'app.config.ts',
      '.*.routes.ts',
    ],
    coverageThreshold: props.coverageThreshold,
  };
}

export default jestAngularConfig;
