import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../model/domain-library-name.enum';
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
  const jestConfig = tree.read(jestConfigPath);

  let jestConfigString = jestConfig.toString('utf8');
  const lastBracketIndex = jestConfigString.lastIndexOf('}');
  jestConfigString = `${jestConfigString.slice(
    0,
    lastBracketIndex
  )}reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports',  outputName: "${projectName}.xml" } ] ]${jestConfigString.slice(
    lastBracketIndex
  )}`;
  tree.overwrite(jestConfigPath, jestConfigString);
  formatFile(tree, jestConfigPath);
  return tree;
};
