import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { addPropertyToJestConfig } from '../../../utils/jest-config';
import { getParsedDomain } from '../../../utils/domain';
import { formatFile } from '../../../utils/prettier';

export const addJestJunitReporter = (
  application: string,
  domain: string,
  libraryType: DomainLibraryName
): Rule => (tree: Tree, _context: SchematicContext) => {
  const projectName = `${application}-${getParsedDomain(
    domain
  )}-${libraryType}`;
  const jestConfigPath = `libs/${application}/${domain}/${libraryType}/jest.config.js`;
  addPropertyToJestConfig(tree, jestConfigPath, 'reporters', [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-reports',
        outputName: `${projectName}.xml`,
      },
    ],
  ]);
  formatFile(tree, jestConfigPath);
  return tree;
};
