import * as testingUtils from '../../../utils/testing';
import { removeCypressProject } from './remove-cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';

describe('removeCypressProject', () => {
  const application = 'test-application';
  const leafDomain = 'leaf-domain';
  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest
      .spyOn(testingUtils, 'getExternalSchematic')
      .mockReturnValue(testingUtils.emptyRule);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove e2e project', () => {
    removeCypressProject(application, leafDomain, CypressProject.E2E, appTree);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/workspace',
      'remove',
      {
        projectName: `${CypressProject.E2E}-${application}-${leafDomain}`,
      }
    );
  });
});
