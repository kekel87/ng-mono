/* eslint-disable */
import jestAngularConfig from '../../jest.angular.config';

export default {
  ...jestAngularConfig,
  displayName: 'netatmo',
  cacheDirectory: '../../.cache/jest/apps/netatmo',
  coverageDirectory: '../../coverage/apps/netatmo',
};
