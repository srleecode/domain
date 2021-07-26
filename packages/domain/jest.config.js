module.exports = {
  displayName: 'domain',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/packages/domain',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  testEnvironment: 'node',
};
