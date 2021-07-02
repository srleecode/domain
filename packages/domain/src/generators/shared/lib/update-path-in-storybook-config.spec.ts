import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as domainUtils from '../utils/domain';
import * as treeUtils from '../utils/tree';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { updatePathInStorybookConfig } from './update-path-in-storybook-config';
import { CypressProject } from '../model/cypress-project.enum';

const defaultRequirePath = `require.context('../src/lib', true, /\\.stories\\.(j|t)sx?$/)`;
const configFileStart = `import { configure, addDecorator } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs);
configure([`;
const configFileEnd = `], module);`;

describe('updatePathInStorybookConfig', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';
  describe('configJs', () => {
    const configJsPath = `libs/${application}/${domain}/.${CypressProject.Storybook}/config.js`;
    const configJs = `${configFileStart}${defaultRequirePath}${configFileEnd}`;
    beforeEach(() => {
      jest.clearAllMocks();
      appTree = createTreeWithEmptyWorkspace();
      jest
        .spyOn(treeUtils, 'overwriteInTree')
        .mockImplementation(() => undefined);

      appTree.write(configJsPath, configJs);
    });

    it('should add feature library import when feature library is in domain', () => {
      jest
        .spyOn(domainUtils, 'getLibraryTypes')
        .mockReturnValue([DomainLibraryName.Feature]);
      updatePathInStorybookConfig(appTree, application, domain);

      expect(treeUtils.overwriteInTree).toHaveBeenCalledWith(
        expect.anything(),
        configJsPath,
        `${configFileStart}require.context('../feature/src/lib', true, /.stories.ts$/)${configFileEnd}`
      );
    });
    it('should add ui library import when ui library is in domain', () => {
      jest
        .spyOn(domainUtils, 'getLibraryTypes')
        .mockReturnValue([DomainLibraryName.Ui]);
      updatePathInStorybookConfig(appTree, application, domain);

      expect(treeUtils.overwriteInTree).toHaveBeenCalledWith(
        expect.anything(),
        configJsPath,
        `${configFileStart}require.context('../ui/src/lib', true, /.stories.ts$/)${configFileEnd}`
      );
    });
    it('should add both feature and ui library import when feature and ui library is in domain', () => {
      jest
        .spyOn(domainUtils, 'getLibraryTypes')
        .mockReturnValue([DomainLibraryName.Feature, DomainLibraryName.Ui]);
      updatePathInStorybookConfig(appTree, application, domain);

      expect(treeUtils.overwriteInTree).toHaveBeenCalledWith(
        expect.anything(),
        configJsPath,
        `${configFileStart}require.context('../feature/src/lib', true, /.stories.ts$/),require.context('../ui/src/lib', true, /.stories.ts$/)${configFileEnd}`
      );
    });
  });

  describe('mainJs', () => {
    const mainJsPath = `libs/${application}/${domain}/.${CypressProject.Storybook}/main.js`;
    const mainJs = `const rootMain = require('../../../../.storybook/main');

rootMain.core = { ...rootMain.core, builder: 'webpack5' };

// Use the following syntax to add addons!
// rootMain.addons.push('../../../../.storybook/main.js');
rootMain.stories.push(
  ...['../src/lib/**/*.stories.mdx', '../src/lib/**/*.stories.@(js|jsx|ts|tsx)']
);

module.exports = rootMain;`;

    beforeEach(() => {
      jest.clearAllMocks();
      appTree = createTreeWithEmptyWorkspace();

      appTree.write(mainJsPath, mainJs);
    });
    it('should add both feature and ui library import when feature and ui library is in domain', () => {
      const spy = jest
        .spyOn(treeUtils, 'overwriteInTree')
        .mockImplementation(() => undefined);
      jest
        .spyOn(domainUtils, 'getLibraryTypes')
        .mockReturnValue([DomainLibraryName.Feature, DomainLibraryName.Ui]);
      updatePathInStorybookConfig(appTree, application, domain);
      const args = spy.mock.calls[0];
      const path = args[1];
      const content = args[2];
      expect(path).toBe(mainJsPath);
      expect(
        content.includes(
          `'../feature/src/lib/**/*.stories.*','../ui/src/lib/**/*.stories.*'`
        )
      ).toBe(true);
    });
  });
});
