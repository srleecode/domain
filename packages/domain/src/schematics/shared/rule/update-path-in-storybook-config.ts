import { SchematicContext, Tree, Rule } from '@angular-devkit/schematics';
import { overwriteInTree } from '../../../utils/tree';
import { getLibraryTypes } from '../../../utils/domain';
import { DomainLibraryName } from '../model/domain-library-name.enum';

export const updatePathInStorybookConfig = (
  application: string,
  domain: string
): Rule => (tree: Tree, _context: SchematicContext) => {
  const configJsFilePath = `libs/${application}/${domain}/.storybook/config.js`;
  const libraryTypes = getLibraryTypes(application, domain, tree);
  const isHavingFeatureLibrary = libraryTypes.some(
    (type) => type === DomainLibraryName.Feature
  );
  const isHavingUiLibrary = libraryTypes.some(
    (type) => type === DomainLibraryName.Ui
  );
  let importPaths = '';
  if (isHavingFeatureLibrary) {
    importPaths += `require.context('../feature/src/lib', true, /\.stories\.ts$/)`;
  }
  if (isHavingFeatureLibrary && isHavingUiLibrary) {
    importPaths += `,`;
  }
  if (isHavingUiLibrary) {
    importPaths += `require.context('../ui/src/lib', true, /\.stories\.ts$/)`;
  }
  const configJs = tree.read(configJsFilePath);
  const configJsString = configJs.toString();
  const updatedConfigJs = configJsString.replace(
    /configure\(.*;/,
    `configure([${importPaths}], module);`
  );
  overwriteInTree(tree, configJsFilePath, updatedConfigJs);
  return tree;
};
