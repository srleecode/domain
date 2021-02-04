import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { checkDomainFolderIsEmpty } from './check-domain-folder-is-empty';

describe('checkDomainFolderIsEmpty', () => {
  const application = 'application';
  const domain = 'domain';
  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    appTree.create(
      `libs/${application}/${domain}/${DomainLibraryName.DataAccess}/src/index.ts`,
      ''
    );
  });

  it('should throw exception when content is already in the domain', () => {
    expect(() =>
      checkDomainFolderIsEmpty(application, domain, appTree)
    ).toThrowError(
      new SchematicsException(
        `libs/${application}/${domain} already exists and it has content in it`
      )
    );
  });
});
