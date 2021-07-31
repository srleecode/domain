module.exports = {
  displayName: 'domain-e2e',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/domain-e2e',
  testSequencer: './test-sequencer.js',
  maxWorkers: 1,
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
