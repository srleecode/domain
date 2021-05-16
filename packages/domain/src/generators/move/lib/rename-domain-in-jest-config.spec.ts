import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { renameDomainInJestConfig } from './rename-domain-in-jest-config';

const jestConfig = `module.exports = {
  projects: [
    '<rootDir>/libs/bank-application/advisers/cash-account/data-access',
    '<rootDir>/libs/bank-application/advisers/cash-account/feature',
    '<rootDir>/libs/bank-application/advisers/cash-account/shell',
    '<rootDir>/libs/bank-application/advisers/cash-account/ui',
    '<rootDir>/libs/bank-application/advisers/cash-account/util',
  ],
};`;
const updatedJestConfig = `module.exports = {
  projects: [
    '<rootDir>/libs/bank-application/advisers/wrap-account/data-access',
    '<rootDir>/libs/bank-application/advisers/wrap-account/feature',
    '<rootDir>/libs/bank-application/advisers/wrap-account/shell',
    '<rootDir>/libs/bank-application/advisers/wrap-account/ui',
    '<rootDir>/libs/bank-application/advisers/wrap-account/util',
  ],
};`;
describe('renameDomainInJestConfig', () => {
  let appTree: Tree;
  const application = 'bank-application';
  const domain = 'advisers/cash-account';
  const newDomain = 'advisers/wrap-account';
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    appTree.write('jest.config.js', jestConfig);
  });

  it('should rename domain in jest config', () => {
    renameDomainInJestConfig(appTree, application, domain, newDomain);
    expect(appTree.read('jest.config.js').toString()).toBe(updatedJestConfig);
  });
});
