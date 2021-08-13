module.exports = {
  displayName: 'domain-cypress-e2e',
  preset: '../../../../../jest.preset.js',
  coverageDirectory: '../../../../../coverage/packages/domain/generators/cypress/e2e',
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
