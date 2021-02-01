import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { addIndexFile } from './add-index-file';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import * as treeUtils from '../../../utils/tree';

describe('create schematic', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'test-domain';
  const library = DomainLibraryName.DataAccess;

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest.spyOn(treeUtils, 'createInTree').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add index file', () => {
    addIndexFile(application, domain, library)(appTree, undefined);
    expect(treeUtils.createInTree).toHaveBeenNthCalledWith(
      1,
      appTree,
      `libs/${application}/${domain}/${library}/src/private-api.ts`,
      ``
    );
  });
});
