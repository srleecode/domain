import * as testingUtils from '../../../utils/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { createCypressProject } from './create-cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Linter } from '@nrwl/workspace';

describe('createCypressProject', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const leafDomain = 'leaf-domain';
  const parentDomain = 'parent-domain/shared';
  const childDomain = 'parent-domain/child-domain';
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest
      .spyOn(testingUtils, 'getExternalSchematic')
      .mockReturnValue(testingUtils.emptyRule);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate cypress project with correct directory and name for leaf domain', () => {
    createCypressProject(
      application,
      leafDomain,
      Linter.EsLint,
      CypressProject.E2E
    );
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/cypress',
      'cypress-project',
      {
        directory: `${CypressProject.E2E}/${application}`,
        js: false,
        linter: Linter.EsLint,
        name: 'leaf-domain',
        project: '',
      }
    );
  });
  it('should generate cypress project with correct directory and name for parent domain', () => {
    createCypressProject(
      application,
      parentDomain,
      Linter.EsLint,
      CypressProject.E2E
    );
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/cypress',
      'cypress-project',
      {
        directory: `${CypressProject.E2E}/${application}/parent-domain`,
        js: false,
        linter: Linter.EsLint,
        name: 'shared',
        project: '',
      }
    );
  });
  it('should generate cypress project with correct directory and name for child domain', () => {
    createCypressProject(
      application,
      childDomain,
      Linter.EsLint,
      CypressProject.E2E
    );
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/cypress',
      'cypress-project',
      {
        directory: `${CypressProject.E2E}/${application}/parent-domain`,
        js: false,
        linter: Linter.EsLint,
        name: 'child-domain',
        project: '',
      }
    );
  });
});
