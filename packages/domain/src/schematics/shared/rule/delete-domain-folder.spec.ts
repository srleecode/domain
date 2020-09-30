import * as treeUtils from '../../../utils/tree';
import { deleteDomainFolder } from './delete-domain-folder';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { create } from 'domain';
import { testRunner } from '../../../utils/testing';

describe('deleteDomainFolder', () => {
  let tree: UnitTestTree;
  const application = 'test-application';
  const parentDomain = 'parent-domain/shared';
  const childDomain = 'parent-domain/child-domain';
  const leafDomain = 'leaf-domain';
  beforeEach(() => {
    tree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest.spyOn(treeUtils, 'deleteInTree').mockImplementation(() => {});
  });

  const createDomainFolder = (application: string, domain: string) =>
    tree.create(`/libs/${application}/${domain}/data-access/src/index.ts`, '');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete leaf domain root folder', async () => {
    createDomainFolder(application, leafDomain);
     (await testRunner
      .callRule(
         deleteDomainFolder(application, leafDomain),
        tree
      )
      .toPromise())
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      1,
      tree,
      `libs/${application}/${leafDomain}`
    );
  });
  it('should delete child domain root folder', async () => {
    createDomainFolder(application, childDomain);
    (await testRunner
      .callRule(
         deleteDomainFolder(application, childDomain),
        tree
      )
      .toPromise())
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      1,
      tree,
      `libs/${application}/${childDomain}`
    );
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      2,
      tree,
      `libs/${application}/parent-domain`
    );
  });
  it('should delete parent domain root folder', async () => {
    createDomainFolder(application, parentDomain);
     (await testRunner
      .callRule(
         deleteDomainFolder(application, parentDomain),
        tree
      )
      .toPromise())
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      1,
      tree,
      `libs/${application}/${parentDomain}`
    );
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      2,
      tree,
      `libs/${application}/parent-domain`
    );
  });
  it('should not delete top level domain folder when other second level domains still exist', async () => {
    createDomainFolder(application, parentDomain);
    createDomainFolder(application, childDomain);
     (await testRunner
      .callRule(
         deleteDomainFolder(application, childDomain),
        tree
      )
      .toPromise())
    expect(treeUtils.deleteInTree).toHaveBeenCalledTimes(1);
  });
});
