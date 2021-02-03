import { addPropertyToJestConfig } from '@nrwl/jest';
import { SchematicContext, Rule, Tree } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../model/domain-library-name.enum';

// cypress projects don't use jest, but the workspace remove schematic fails if there isn't a jest config project reference
// This is being used, but would not be needed if the workspace remove schematic or another schematic that can remove cypress projects didn't fail due to not having a jest config project reference
export const addProjectToJestConfig = (
  application: string,
  domain: string,
  projectType: DomainLibraryName | '.cypress'
): Rule => (tree: Tree, context: SchematicContext): Tree => {
  addPropertyToJestConfig(
    {
      ...tree,
      read: (path: string) => tree.read(path),
      write: (path: string, updatedContents) =>
        tree.overwrite(path, updatedContents),
      exists: (filePath: string) => tree.exists(filePath),
    } as any,
    'jest.config.js',
    'projects',
    `<rootDir>/libs/${application}/${domain}/${projectType}`
  );
  return tree;
};
