import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { getParsedDomain } from '../../../utils/domain';
import { formatFile } from '../../../utils/prettier';
import { readInTree } from '../../../utils/tree';

export const addJestJunitReporter = (
  application: string,
  domain: string,
  libraryType: DomainLibraryName
): Rule => (tree: Tree, _context: SchematicContext) => {
  const projectName = `${application}-${getParsedDomain(
    domain
  )}-${libraryType}`;
  const jestConfigPath = `libs/${application}/${domain}/${libraryType}/jest.config.js`;
  const jestConfig = readInTree(tree, jestConfigPath);

  let jestConfigString = jestConfig.toString('utf8').replace(/\s/g, '');
  const lastBracketIndex = jestConfigString.lastIndexOf('}');
  const includesLastLineCommaPrefix =
    jestConfigString[lastBracketIndex - 1] === ',';
  jestConfigString = `${jestConfigString.slice(0, lastBracketIndex)}${
    includesLastLineCommaPrefix ? '' : ','
  } reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "${projectName}.xml" } ] ]${jestConfigString.slice(
    lastBracketIndex
  )}`;
  tree.overwrite(jestConfigPath, jestConfigString);
  formatFile(tree, jestConfigPath);
  return tree;
};
