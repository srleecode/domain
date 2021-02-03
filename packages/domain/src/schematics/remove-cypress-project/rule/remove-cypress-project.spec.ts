import * as testingUtils from '../../../utils/testing';
import { removeCypressProject } from './remove-cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import * as workspaceImport from '@nrwl/workspace/src/generators/remove/remove';

describe('removeCypressProject', () => {
  const application = 'test-application';
  const leafDomain = 'leaf-domain';
  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest
      .spyOn(workspaceImport, 'removeSchematic')
      .mockReturnValue(testingUtils.emptyRule as any);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove e2e project', () => {
    removeCypressProject(application, leafDomain, CypressProject.E2E, appTree);
    expect(workspaceImport.removeSchematic).toHaveBeenCalledWith({
      projectName: `${CypressProject.E2E}-${application}-${leafDomain}`,
      skipFormat: false,
      forceRemove: false,
    });
  });
});
