module.exports = {
  displayName: 'domain-react-add',
  preset: '../../../../jest.preset.js',
  coverageDirectory: '../../../../coverage/packages/domain/generators/reactAdd',
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
