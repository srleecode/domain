import { Tree } from '@nrwl/devkit';
import { readFileSync } from 'fs';
import { FilesContents } from './model/file-contents.model';

export const getFilesContents = (
  tree: Tree,
  treeFilePath: string,
  projectFilePath: string,
  isSpacesRemoved = true
): FilesContents => {
  const treeFile = tree.read(treeFilePath).toString();
  const expectedFile = readFileSync(projectFilePath).toString();
  return {
    treeFile: isSpacesRemoved ? removeSpaces(treeFile) : treeFile,
    expectedFile: isSpacesRemoved ? removeSpaces(expectedFile) : expectedFile,
  };
};

const removeSpaces = (content: string): string =>
  (content || '').replace(/\s/g, '');
