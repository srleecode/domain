import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { testRunner } from '../../../utils/testing';
import { addParentDomainDependencyRule } from './add-parent-domain-dependency';
import { readJsonInTree } from '@nrwl/workspace';

describe('checkParentDomain', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const parentDomain = 'parent-domain';
  const parsedDomain = `${parentDomain}-child-domain`;

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  it('should add parent domain dependency to new child domain', async () => {
    appTree = (await testRunner
      .callRule(
        addParentDomainDependencyRule(application, parentDomain, parsedDomain),
        appTree
      )
      .toPromise()) as UnitTestTree;

    const tsLint = readJsonInTree(appTree, 'tslint.json');
    expect(
      tsLint.rules['nx-enforce-module-boundaries'][1].depConstraints
    ).toEqual([
      {
        onlyDependOnLibsWithTags: [
          'scope:test-application-parent-domain-shared',
        ],
        sourceTag: 'scope:test-application-parent-domain-child-domain',
      },
    ]);
  });
});
