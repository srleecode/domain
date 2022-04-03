import { Tree } from '@nrwl/devkit';
import { findNodes } from '@nrwl/workspace';
import { SyntaxKind, ClassDeclaration } from 'typescript';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getTsSourceFile } from '../../../../../shared/utils';

export const getComponentClassName = (tree: Tree, path: string): string => {
  const file = getTsSourceFile(tree, path);
  const cls = findNodes(
    file,
    SyntaxKind.ClassDeclaration
  ) as ClassDeclaration[];
  return cls[0].name.getText();
};
