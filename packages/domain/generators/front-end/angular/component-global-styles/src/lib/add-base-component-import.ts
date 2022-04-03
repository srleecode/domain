import {
  applyChangesToString,
  ChangeType,
  StringChange,
  Tree,
} from '@nrwl/devkit';
import { findNodes } from '@nrwl/workspace';
import { SyntaxKind } from 'typescript';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getTsSourceFile } from '../../../../../shared/utils';

export const addBaseComponentImport = (
  tree: Tree,
  componentFilePath: string,
  componentClassName: string
) => {
  const source = getTsSourceFile(tree, componentFilePath);
  const allImports = findNodes(source, SyntaxKind.ImportDeclaration);
  if (allImports.length > 0) {
    const lastImport = allImports[allImports.length - 1];
    const changes: StringChange[] = [
      {
        type: ChangeType.Insert,
        index: lastImport.end + 1,
        text: `import { ${componentClassName} } from './base.component';\n`,
      },
    ];
    const newFile = applyChangesToString(
      tree.read(componentFilePath).toString(),
      changes
    );
    tree.write(componentFilePath, newFile);
  }
};
