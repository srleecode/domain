import { Tree } from '@angular-devkit/schematics';
import { getParsedDomain } from '../../../utils/domain';
import { existsInTree, getDirInTree } from '../../../utils/tree';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { logging } from '@angular-devkit/core';

export const getModuleFilePath = (
  application: string,
  domain: string,
  libraryType: DomainLibraryName,
  tree: Tree,
  logger: logging.LoggerApi
): string => {
  const defaultModuleFileName = `${application}-${getParsedDomain(
    domain
  )}-${libraryType}.module.ts`;
  const moduleFolderPath = `libs/${application}/${domain}/${libraryType}/src/lib`;
  const defaultModuleFilePath = `${moduleFolderPath}/${defaultModuleFileName}`;
  if (existsInTree(tree, defaultModuleFilePath)) {
    return defaultModuleFilePath;
  }
  const moduleFolder = getDirInTree(tree, moduleFolderPath);
  const moduleFiles = moduleFolder.subfiles.filter(
    (file) => !file.includes('routing') && file.includes('.module')
  );
  if (moduleFiles.length === 0) {
    logger.error(`Unable to find ${defaultModuleFileName} or any .module file`);
  } else if (moduleFiles.length > 1) {
    logger.warn(
      `Unable to find ${defaultModuleFileName}. Found multiple module file in directory using the first which is ${moduleFiles[0]}`
    );
  }
  return `${moduleFolderPath}/${moduleFiles[0]}`;
};
