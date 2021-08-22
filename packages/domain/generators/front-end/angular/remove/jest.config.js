module.exports = {
  displayName: 'domain-front-end-angular-remove',
  preset: '../../../../../../jest.preset.js',
  coverageDirectory: '../../../../../../coverage/packages/domain/generators/front-end/angular/remove',
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
