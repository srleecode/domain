module.exports = {
  displayName: 'domain-grouping-folder-create-app',
  preset: '../../../../../jest.preset.js',
  coverageDirectory: '../../../../../coverage/packages/domain/generators/grouping-folder/create-app',
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
