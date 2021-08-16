module.exports = {
  displayName: 'domain-mock-file',
  preset: '../../../../jest.preset.js',
  coverageDirectory: '../../../../coverage/packages/domain/generators/mock-file',
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
