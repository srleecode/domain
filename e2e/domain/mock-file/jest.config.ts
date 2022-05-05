module.exports = {
  displayName: 'e2e-domain-mock-file',
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
  coverageDirectory: '../../../coverage/packages/e2e-domain-mock-file',
  preset: '../../../jest.preset.ts',
  testSequencer: './test-sequencer.js',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  maxWorkers: 1,
};
