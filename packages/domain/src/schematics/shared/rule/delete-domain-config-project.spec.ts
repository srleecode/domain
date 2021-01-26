import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { testRunner } from '../../../utils/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { deleteDomainConfigProject } from './delete-domain-config-project';

describe('deleteDomainConfigProject', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'domain';

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    const json = {
      [`${application}-${domain}`]: {
        buildable: true,
        enableIvy: true,
        strict: false,
      },
    };
    appTree.create('domain.config.json', JSON.stringify(json));
  });

  it('should rename project name in domain config json', async () => {
    appTree = (await testRunner
      .callRule(deleteDomainConfigProject(application, domain), appTree)
      .toPromise()) as UnitTestTree;

    const json = readJsonInTree(appTree, 'domain.config.json');
    expect(json).toEqual({});
  });
});
