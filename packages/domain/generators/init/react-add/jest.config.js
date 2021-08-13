module.exports = {
  displayName: 'domain-init-react-add',
  preset: '../../../../../jest.preset.js',
  coverageDirectory: '../../../../../coverage/packages/domain/generators/init/react-add',
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
