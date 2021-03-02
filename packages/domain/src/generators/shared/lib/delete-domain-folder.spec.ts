import * as treeUtils from '../utils/tree';
import { deleteDomainFolder } from './delete-domain-folder';
import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

describe('deleteDomainFolder', () => {
  let tree: Tree;
  const application = 'test-application';
  const parentDomain = 'parent-domain/shared';
  const childDomain = 'parent-domain/child-domain';
  const leafDomain = 'leaf-domain';
  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(treeUtils, 'deleteInTree').mockImplementation(() => undefined);
  });

  const createDomainFolder = (application: string, domain: string) =>
    tree.write(`/libs/${application}/${domain}/data-access/src/index.ts`, '');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete leaf domain root folder', () => {
    createDomainFolder(application, leafDomain);
    deleteDomainFolder(tree, application, leafDomain);
    expect(treeUtils.deleteInTree).toHaveBeenNthCalledWith(
      1,
      tree,
      `libs/${application}/${leafDomain}`
    );
  });
  it('should delete child domain root folder', () => {
    createDomainFolder(application, childDomain);
    deleteDomainFolder(tree, application, childDomain);
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
  it('should delete parent domain root folder', () => {
    createDomainFolder(application, parentDomain);
    deleteDomainFolder(tree, application, parentDomain);
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
  it('should not delete top level domain folder when other second level domains still exist', () => {
    createDomainFolder(application, parentDomain);
    createDomainFolder(application, childDomain);
    deleteDomainFolder(tree, application, childDomain);
    expect(treeUtils.deleteInTree).toHaveBeenCalledTimes(1);
  });
});
