import {
  applyChangesToString,
  ChangeType,
  StringChange,
  Tree,
} from '@nrwl/devkit';
import { findNodes } from '@nrwl/workspace';
import { SyntaxKind } from 'typescript';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getTsSourceFile } from '../../../shared/utils';

// these are excluded as they should be set globally in the jest.preset
const excludedProperties = [
  'snapshotSerializers',
  'transformIgnorePatterns',
  'transform',
];

export const removeGlobalJestConfig = (tree: Tree, libraryPath: string) => {
  let jestConfigPath = `${libraryPath}/jest.config.js`;
  if (!jestConfigPath.startsWith('libs')) {
    jestConfigPath = `libs/${jestConfigPath}`;
  }
  const file = getTsSourceFile(tree, jestConfigPath);
  const propertyAssignments = findNodes(file, SyntaxKind.PropertyAssignment);
  const changes: StringChange[] = propertyAssignments
    .filter((node) => {
      const identifier = node.getChildAt(0);
      return (
        identifier.kind === SyntaxKind.Identifier &&
        excludedProperties.includes(identifier.getText())
      );
    })
    .map((node) => ({
      type: ChangeType.Delete,
      start: node.getStart(),
      length: node.end + 1 - node.getStart(),
    }));
  const newFile = applyChangesToString(
    tree.read(jestConfigPath).toString(),
    changes
  );
  tree.write(jestConfigPath, newFile);
};