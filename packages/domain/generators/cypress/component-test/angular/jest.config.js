module.exports = {
  displayName: 'domain-cypress-component-test-angular',
  preset: '../../../../../../jest.preset.js',
  coverageDirectory: '../../../../../../coverage/packages/domain/generators/cypress/component-test/angular',
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
