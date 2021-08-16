module.exports = {
  displayName: 'domain-angular-domain-layer',
  preset: '../../../../../../jest.preset.js',
  coverageDirectory: '../../../../../../coverage/packages/domain/generators/front-end/angular/domain-layer',
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
