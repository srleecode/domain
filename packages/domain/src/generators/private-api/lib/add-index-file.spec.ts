import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import { addIndexFile } from './add-index-file';
import * as treeUtils from '../../shared/utils/tree';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

describe('create schematic', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';
  const library = DomainLibraryName.DataAccess;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    jest.spyOn(treeUtils, 'createInTree').mockImplementation(() => undefined);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add index file', () => {
    addIndexFile(application, domain, library, appTree);
    expect(treeUtils.createInTree).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      `libs/${application}/${domain}/${library}/src/private-api.ts`,
      ``
    );
  });
});
