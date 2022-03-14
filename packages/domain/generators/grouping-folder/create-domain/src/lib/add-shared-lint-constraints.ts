import { Tree } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getGroupingFolders,
  updateDepConstraint,
} from '../../../../shared/utils';
import { CreateDomainGroupingFolderGeneratorSchema } from '../schema';

export const addSharedLintContraints = (
  tree: Tree,
  options: CreateDomainGroupingFolderGeneratorSchema
): void => {
  const { name, groupingFolder } = options;
  const groupingFolders = getGroupingFolders(tree, `${groupingFolder}/${name}`);
  const scope = `scope:${groupingFolders.app}-${groupingFolders.domain.join(
    '-'
  )}`;
  updateDepConstraint(tree, (depConstraints) => {
    depConstraints.push({
      sourceTag: scope,
      onlyDependOnLibsWithTags: [scope],
      notDependOnLibsWithTags: [],
    });
    if (groupingFolders.domain.length > 1) {
      depConstraints.push({
        sourceTag: scope,
        notDependOnLibsWithTags: [],
        onlyDependOnLibsWithTags: [
          `scope:${groupingFolders.app}-${groupingFolders.domain[0]}-shared`,
        ],
      });
    }
    depConstraints.push({
      sourceTag: scope,
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: [`scope:${groupingFolders.app}-shared`],
    });
    const appType = groupingFolders.app.split('-')?.[0];
    depConstraints.push({
      sourceTag: scope,
      notDependOnLibsWithTags: [],
      onlyDependOnLibsWithTags: [`app:${appType}-shared`],
    });
  });
};
