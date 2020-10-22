import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as domainUtils from '../../../utils/domain';
import * as treeUtils from '../../../utils/tree';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { updatePathInStorybookConfig } from './update-path-in-storybook-config';
import { testRunner } from '../../../utils/testing';
import { CypressProject } from '../model/cypress-project.enum';

const defaultRequirePath = `require.context('../src/lib', true, /\.stories\.(j|t)sx?$/)`;
const configFileStart = `import { configure, addDecorator } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs);
configure([`;
const configFileEnd = `], module);`;

describe('updatePathInStorybookConfig', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'test-domain';
  const configJsPath = `libs/${application}/${domain}/.${CypressProject.Storybook}/config.js`;
  const configJs = `${configFileStart}${defaultRequirePath}${configFileEnd}`;
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest.spyOn(treeUtils, 'overwriteInTree').mockImplementation(() => {});

    appTree.create(configJsPath, configJs);
  });

  it('should add feature library import when feature library is in domain', async () => {
    jest
      .spyOn(domainUtils, 'getLibraryTypes')
      .mockReturnValue([DomainLibraryName.Feature]);
    appTree = (await testRunner
      .callRule(updatePathInStorybookConfig(application, domain), appTree)
      .toPromise()) as UnitTestTree;

    expect(treeUtils.overwriteInTree).toHaveBeenCalledWith(
      expect.anything(),
      configJsPath,
      `${configFileStart}require.context('../feature/src/lib', true, /.stories.ts$/)${configFileEnd}`
    );
  });
  it('should add ui library import when ui library is in domain', async () => {
    jest
      .spyOn(domainUtils, 'getLibraryTypes')
      .mockReturnValue([DomainLibraryName.Ui]);
    appTree = (await testRunner
      .callRule(updatePathInStorybookConfig(application, domain), appTree)
      .toPromise()) as UnitTestTree;

    expect(treeUtils.overwriteInTree).toHaveBeenCalledWith(
      expect.anything(),
      configJsPath,
      `${configFileStart}require.context('../ui/src/lib', true, /.stories.ts$/)${configFileEnd}`
    );
  });
  it('should add both feature and ui library import when feature and ui library is in domain', async () => {
    jest
      .spyOn(domainUtils, 'getLibraryTypes')
      .mockReturnValue([DomainLibraryName.Feature, DomainLibraryName.Ui]);
    appTree = (await testRunner
      .callRule(updatePathInStorybookConfig(application, domain), appTree)
      .toPromise()) as UnitTestTree;

    expect(treeUtils.overwriteInTree).toHaveBeenCalledWith(
      expect.anything(),
      configJsPath,
      `${configFileStart}require.context('../feature/src/lib', true, /.stories.ts$/),require.context('../ui/src/lib', true, /.stories.ts$/)${configFileEnd}`
    );
  });
});
