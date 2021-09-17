module.exports = {
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  maxWorkers: 1,
  testSequencer: './test-sequencer.js',
  displayName: 'e2e-domain-cypress-domain-test',
  setupFilesAfterEnv: ['./jest.setup.ts'],
};