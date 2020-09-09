import * as testingUtils from '../../../utils/testing';
import { Linter } from '@nrwl/workspace';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { createCypressProject } from './create-cypress-project';

describe('createCypressProject', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const leafDomain = 'leaf-domain';
  const parentDomain = 'parent-domain/shared';
  const childDomain = 'parent-domain/child-domain';
  const linter = Linter.EsLint;
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
    createCypressProject(application, leafDomain, linter);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/cypress',
      'cypress-project',
      {
        directory: 'e2e/test-application',
        js: false,
        linter,
        name: 'leaf-domain',
        project: '',
      }
    );
  });
  it('should generate cypress project with correct directory and name for parent domain', () => {
    createCypressProject(application, parentDomain, linter);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/cypress',
      'cypress-project',
      {
        directory: 'e2e/test-application/parent-domain',
        js: false,
        linter,
        name: 'shared',
        project: '',
      }
    );
  });
  it('should generate cypress project with correct directory and name for child domain', () => {
    createCypressProject(application, childDomain, linter);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/cypress',
      'cypress-project',
      {
        directory: 'e2e/test-application/parent-domain',
        js: false,
        linter,
        name: 'child-domain',
        project: '',
      }
    );
  });
});
