import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { testRunner } from '../../../utils/testing';
import { addMockFile } from './add-mock-file';
import { getParsedDomain } from '../../../utils/domain';

describe('create schematic', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'test-domain';

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  it('should add index file', async () => {
    await testRunner
      .callRule(addMockFile(application, domain), appTree)
      .toPromise();
    expect(
      appTree
        .read(`libs/${application}/${domain}/util/src/testing.ts`)
        .toString()
    ).toBe(`export * from './lib/model/${domain}.mock`);
  });

  it('should add mock file', async () => {
    await testRunner
      .callRule(addMockFile(application, domain), appTree)
      .toPromise();
    expect(
      appTree.exists(
        `libs/${application}/${domain}/util/src/lib/model/${domain}.mock.ts`
      )
    ).toBe(true);
  });
  it('should add mock file when child domain', async () => {
    const childDomain = 'parent-domain/child-domain';
    await testRunner
      .callRule(addMockFile(application, childDomain), appTree)
      .toPromise();
    expect(
      appTree.exists(
        `libs/${application}/${childDomain}/util/src/lib/model/${getParsedDomain(
          childDomain
        )}.mock.ts`
      )
    ).toBe(true);
  });
});
