module.exports = {
  displayName: 'e2e-domain-cypress-domain-test',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  maxWorkers: 1,
};
