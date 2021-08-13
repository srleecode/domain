module.exports = {
  displayName: 'domain-init-ng-add',
  preset: '../../../../../jest.preset.js',
  coverageDirectory: '../../../../../coverage/packages/domain/generators/init/ng-add',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  testEnvironment: 'node',
};
