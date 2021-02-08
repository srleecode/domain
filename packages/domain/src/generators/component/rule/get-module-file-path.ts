import { Tree, logger } from '@nrwl/devkit';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { getParsedDomain } from '../../shared/utils/domain';
import { existsInTree } from '../../shared/utils/tree';

export const getModuleFilePath = (
  application: string,
  domain: string,
  libraryType: DomainLibraryName,
  tree: Tree
): string => {
  const defaultModuleFileName = `${application}-${getParsedDomain(
    domain
  )}-${libraryType}.module.ts`;
  const moduleFolderPath = `libs/${application}/${domain}/${libraryType}/src/lib`;
  const defaultModuleFilePath = `${moduleFolderPath}/${defaultModuleFileName}`;
  if (existsInTree(tree, defaultModuleFilePath)) {
    return defaultModuleFilePath;
  }
  const moduleFiles = tree
    .children(moduleFolderPath)
    .filter((file) => !file.includes('routing') && file.includes('.module'));
  if (moduleFiles.length === 0) {
    logger.error(`Unable to find ${defaultModuleFileName} or any .module file`);
  } else if (moduleFiles.length > 1) {
    logger.warn(
      `Unable to find ${defaultModuleFileName}. Found multiple module file in directory using the first which is ${moduleFiles[0]}`
    );
  }
  return `${moduleFolderPath}/${moduleFiles[0]}`;
};
