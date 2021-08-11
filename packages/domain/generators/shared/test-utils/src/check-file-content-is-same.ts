import { Tree } from '@nrwl/devkit';
import { readFileSync } from 'fs';

export const checkFileContentIsSame = (
  tree: Tree,
  treeFilePath: string,
  projectFilePath: string,
  isSpacesRemoved = true
): void => {
  const treeFile = tree.read(treeFilePath).toString();
  const projectFile = readFileSync(projectFilePath).toString();
  if (isSpacesRemoved) {
    expect(removeSpaces(treeFile)).toMatch(removeSpaces(projectFile));
  } else {
    expect(treeFile).toMatch(projectFile);
  }
};

const removeSpaces = (content: string): string =>
  (content || '').replace(/\s/g, '');
