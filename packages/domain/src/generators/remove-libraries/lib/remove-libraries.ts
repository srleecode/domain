import { removeGenerator } from '@nrwl/workspace';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { getProjectNames } from '../../shared/utils/libraries';
import { Tree, logger } from '@nrwl/devkit';

export const removeLibraries = async (
  tree: Tree,
  application: string,
  domain: string,
  libraries: DomainLibraryName[]
): Promise<void> => {
  const projectNames = getProjectNames(application, domain, libraries);
  for (const projectName of projectNames) {
    await removeGenerator(tree, {
      projectName,
      skipFormat: false,
      forceRemove: false,
    }).catch((e) => {
      logger.error(e.message);
      throw e;
    });
  }
};
