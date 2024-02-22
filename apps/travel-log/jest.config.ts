/* eslint-disable */
import jestAngularConfig from '../../jest.angular.config';

export default {
  ...jestAngularConfig,
  passWithNoTests: true,
  displayName: 'travel-log',
  cacheDirectory: '../../.cache/jest/apps/travel-log',
  coverageDirectory: '../../coverage/apps/travel-log',
};
