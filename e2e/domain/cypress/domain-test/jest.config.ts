module.exports = {
  displayName: 'e2e-domain-cypress-domain-test',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  preset: '../../../../jest.preset.js',
  testSequencer: './test-sequencer.js',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  maxWorkers: 1,
};
