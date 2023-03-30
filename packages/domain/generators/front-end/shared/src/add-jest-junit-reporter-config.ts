import { Tree } from '@nrwl/devkit';
import { dasherize } from '@nrwl/workspace/src/utils/strings';

export const addJestJunitReporterConfig = (tree: Tree, libraryPath: string) => {
  let jestConfigPath = `${libraryPath}/jest.config.ts`;
  if (!jestConfigPath.startsWith('libs')) {
    jestConfigPath = `libs/${jestConfigPath}`;
  }
  const jestConfig = tree.exists(jestConfigPath)
    ? tree.read(jestConfigPath)
    : tree.read(jestConfigPath.replace(new RegExp('js$'), 'ts'));
  let jestConfigString = jestConfig.toString('utf8').replace(/\s/g, '');
  const lastBracketIndex = jestConfigString.lastIndexOf('}');
  const includesLastLineCommaPrefix =
    jestConfigString[lastBracketIndex - 1] === ',';
  jestConfigString = `${jestConfigString.slice(0, lastBracketIndex)}${
    includesLastLineCommaPrefix ? '' : ','
  } reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "${dasherize(
    libraryPath.replace('libs/', '')
  )}.xml" } ] ]${jestConfigString.slice(lastBracketIndex)}`;
  tree.write(jestConfigPath, jestConfigString);
};
