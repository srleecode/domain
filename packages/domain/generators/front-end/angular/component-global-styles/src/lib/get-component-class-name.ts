import { Tree } from '@nx/devkit';
import { SyntaxKind, ClassDeclaration } from 'typescript';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getTsSourceFile } from '../../../../../shared/utils';
import { findNodes } from '@nx/workspace/src/utilities/ts-config';

export const getComponentClassName = (tree: Tree, path: string): string => {
  const file = getTsSourceFile(tree, path);
  const cls = findNodes(
    file,
    SyntaxKind.ClassDeclaration
  ) as ClassDeclaration[];
  return cls[0].name.getText();
};
