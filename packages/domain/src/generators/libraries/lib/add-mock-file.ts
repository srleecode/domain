import { createInTree } from '../../shared/utils/tree';
import { Tree } from '@nrwl/devkit';
import { getParsedDomain } from '../../shared/utils/domain';

export const addMockFile = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  const librarySourceRoot = `libs/${application}/${domain}/util/src`;
  const mockFilePath = `lib/model/${getParsedDomain(domain)}.mock`;
  addIndexFile(tree, librarySourceRoot, mockFilePath);
  addEmptyMockFile(tree, librarySourceRoot, mockFilePath);
};

const addEmptyMockFile = (
  tree: Tree,
  librarySourceRoot: string,
  mockFilePath: string
): void =>
  createInTree(
    tree,
    `${librarySourceRoot}/${mockFilePath}.ts`,
    'export const mock = {};'
  );

const addIndexFile = (
  tree: Tree,
  librarySourceRoot: string,
  mockFilePath: string
): void =>
  createInTree(
    tree,
    `${librarySourceRoot}/testing.ts`,
    `export * from './${mockFilePath}';`
  );
