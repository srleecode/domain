module.exports = {
  displayName: 'domain-e2e',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/e2edomain-e2e',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  testSequencer: './test-sequencer.js',
  maxWorkers: 1,
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
