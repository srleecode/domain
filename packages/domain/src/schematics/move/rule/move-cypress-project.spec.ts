import * as testingUtils from '../../../utils/testing';
import { moveCypressProject } from './move-cypress-project';
import { getParsedDomain } from '../../../utils/domain';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import * as workspaceImport from '@nrwl/workspace/src/generators/move/move';

describe('moveCypressProject', () => {
  const application = 'test-application';
  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest
      .spyOn(workspaceImport, 'moveSchematic')
      .mockReturnValue(testingUtils.emptyRule as any);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate move rules for cypress project when given leaf domain', () => {
    const leafDomain = 'leaf-domain';
    const newLeafDomain = 'new-leaf-domain';
    moveCypressProject(
      application,
      leafDomain,
      newLeafDomain,
      CypressProject.E2E,
      appTree
    );
    expect(workspaceImport.moveSchematic).toHaveBeenCalledWith({
      destination: `${CypressProject.E2E}/${application}/${newLeafDomain}`,
      projectName: `${CypressProject.E2E}-${application}-${leafDomain}`,
      updateImportPath: true,
    });
  });
  it('should generate move rules for cypress project when given parent domain', () => {
    const parentDomain = 'parent-domain/shared';
    const newParentDomain = 'new-parent-domain/shared';
    moveCypressProject(
      application,
      parentDomain,
      newParentDomain,
      CypressProject.E2E,
      appTree
    );
    expect(workspaceImport.moveSchematic).toHaveBeenCalledWith({
      destination: `${CypressProject.E2E}/${application}/${newParentDomain}`,
      projectName: `${CypressProject.E2E}-${application}-${getParsedDomain(
        parentDomain
      )}`,
      updateImportPath: true,
    });
  });
});
