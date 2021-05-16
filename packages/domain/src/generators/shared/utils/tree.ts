import { Tree, logger } from '@nrwl/devkit';
import { sep } from 'path';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { getParsedDomain } from './domain';

export const createInTree = (
  tree: Tree,
  path: string,
  content: Buffer | string
): void => tree.write(path.replace(/\//g, sep), content);

export const deleteInTree = (tree: Tree, path: string): void => {
  const updatedPath = path.replace(/\//g, sep);
  if (tree.isFile(updatedPath)) {
    tree.delete(updatedPath);
  } else {
    // if files are open in the directory when it is deleted using tree.delete it throws an error
    // Deleting the files first before directory so that an error is not thrown
    deleteDirectoryFiles(tree, updatedPath);
    tree.delete(updatedPath);
  }
};

export const readInTree = (tree: Tree, path: string): Buffer =>
  tree.read(path.replace(/\//g, sep));

export const existsInTree = (tree: Tree, path: string): boolean =>
  tree.exists(path.replace(/\//g, sep));

export const renameInTree = (
  tree: Tree,
  fromPath: string,
  toPath: string
): void => {
  tree.rename(fromPath.replace(/\//g, sep), toPath.replace(/\//g, sep));
};

export const getFolderChildren = (tree: Tree, path: string): string[] =>
  tree.isFile(path) ? [] : tree.children(path);

export const overwriteInTree = (
  tree: Tree,
  path: string,
  content: string
): void => tree.write(path.replace(/\//g, sep), content);

export const moveDirectory = (
  tree: Tree,
  fromFolder: string,
  toFolder: string
): void => {
  tree.children(fromFolder).forEach((pathSegment) => {
    const fullPath = `${fromFolder}/${pathSegment}`;
    if (tree.isFile(fullPath)) {
      if (!tree.isFile(`${toFolder}/${pathSegment}`)) {
        tree.rename(fullPath, fullPath.replace(fromFolder, toFolder));
      }
    } else {
      moveDirectory(tree, fullPath, `${toFolder}/${pathSegment}`);
    }
  });
};

export const copyDirectory = (
  tree: Tree,
  fromFolder: string,
  toFolder: string
): void => {
  tree.children(fromFolder).forEach((pathSegment) => {
    const fullPath = `${fromFolder}/${pathSegment}`;
    if (tree.isFile(fullPath)) {
      if (!tree.isFile(`${toFolder}/${pathSegment}`)) {
        tree.write(fullPath.replace(fromFolder, toFolder), tree.read(fullPath));
      }
    } else {
      copyDirectory(tree, fullPath, `${toFolder}/${pathSegment}`);
    }
  });
};

export const deleteDirectoryFiles = (tree: Tree, folder: string): void => {
  tree.children(folder).forEach((pathSegment) => {
    const fullPath = `${folder}/${pathSegment}`;
    if (tree.isFile(fullPath)) {
      tree.delete(fullPath);
    } else {
      deleteDirectoryFiles(tree, fullPath);
    }
  });
};

export const printTreeChanges = (tree: Tree): void =>
  logger.info(
    JSON.stringify(
      tree
        .listChanges()
        .map((change) => ({ path: change.path, type: change.type }))
    )
  );

export const getModuleFilePath = (
  application: string,
  domain: string,
  library: DomainLibraryName
): string => {
  const defaultModuleFileName = `${application}-${getParsedDomain(
    domain
  )}-${library}.module.ts`;
  const moduleFolderPath = `libs/${application}/${domain}/${library}/src/lib`;
  return `${moduleFolderPath}/${defaultModuleFileName}`;
};
