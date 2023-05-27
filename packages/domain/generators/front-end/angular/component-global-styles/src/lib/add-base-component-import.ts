import {
  applyChangesToString,
  ChangeType,
  StringChange,
  Tree,
} from '@nx/devkit';
import { SyntaxKind } from 'typescript';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getTsSourceFile } from '../../../../../shared/utils';
import { findNodes } from '@nx/workspace/src/utilities/ts-config';

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
