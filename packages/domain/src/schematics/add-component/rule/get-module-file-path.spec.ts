import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { getParsedDomain } from '../../../utils/domain';
import { getModuleFilePath } from './get-module-file-path';
import { logging } from '@angular-devkit/core';

describe('getModuleFilePath', () => {
  let appTree: UnitTestTree;
  const application = 'application';
  const domain = 'domain';
  const libraryType = DomainLibraryName.Feature;
  const moduleFolderPath = `libs/${application}/${domain}/${libraryType}/src/lib`;
  const logger = ({ warn: () => {} } as any) as logging.LoggerApi;
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });
  it('should return path for default module if it exists', () => {
    const defaultModuleFileName = `${application}-${getParsedDomain(
      domain
    )}-${libraryType}.module.ts`;
    const defaultModuleFilePath = `${moduleFolderPath}/${defaultModuleFileName}`;
    appTree.create(defaultModuleFilePath, '');
    expect(
      getModuleFilePath(application, domain, libraryType, appTree, logger)
    ).toBe(defaultModuleFilePath);
  });
  it('should return path for first non routing module if the default module does not exist', () => {
    const expectedModuleFilePath = `${moduleFolderPath}/expected.module.ts`;
    appTree.create(`${moduleFolderPath}/routing-test.module.ts`, '');
    appTree.create(expectedModuleFilePath, '');
    expect(
      getModuleFilePath(application, domain, libraryType, appTree, logger)
    ).toBe(expectedModuleFilePath);
  });
});
