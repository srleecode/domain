import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { checkDomainFolderIsEmpty } from './check-domain-folder-is-empty';

describe('checkDomainFolderIsEmpty', () => {
  const application = 'application';
  const domain = 'domain';
  let appTree: Tree;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    appTree.write(
      `libs/${application}/${domain}/${DomainLibraryName.DataAccess}/src/index.ts`,
      ''
    );
  });

  it('should throw exception when content is already in the domain', () => {
    expect(() =>
      checkDomainFolderIsEmpty(appTree, application, domain)
    ).toThrowError(
      new Error(
        `libs/${application}/${domain} already exists and it has content in it`
      )
    );
  });
});
