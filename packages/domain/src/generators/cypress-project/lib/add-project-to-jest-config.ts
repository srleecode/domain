import { addPropertyToJestConfig } from '@nrwl/jest';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { Tree } from '@nrwl/devkit';

// cypress projects don't use jest, but the workspace remove schematic fails if there isn't a jest config project reference
// This is being used, but would not be needed if the workspace remove schematic or another schematic that can remove cypress projects didn't fail due to not having a jest config project reference
export const addProjectToJestConfig = (
  tree: Tree,
  application: string,
  domain: string,
  projectType: DomainLibraryName | '.cypress'
): void => {
  addPropertyToJestConfig(
    {
      ...tree,
      read: (path: string) => tree.read(path),
      write: (path: string, updatedContents) =>
        tree.write(path, updatedContents),
      exists: (filePath: string) => tree.exists(filePath),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    'jest.config.js',
    'projects',
    `<rootDir>/libs/${application}/${domain}/${projectType}`
  );
};
