module.exports = {
  displayName: 'domain-grouping-folder-create-domain',
  preset: '../../../../../jest.preset.js',
  coverageDirectory: '../../../../../coverage/packages/domain/generators/grouping-folder/create-domain',
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
