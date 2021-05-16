import { logger, Tree } from '@nrwl/devkit';
import {
  getParsedDomain,
  getProjects,
  getTopLevelDomain,
} from '../../shared/utils/domain';
import { MoveLibrarySchema } from '../model/move-library-schema.model';

export const getMoveLibrarySchemas = (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string
): MoveLibrarySchema[] => {
  const projects = getProjects(application, domain, tree);
  return projects
    .filter(
      (project) =>
        project.name.startsWith(`${application}-${getParsedDomain(domain)}`) &&
        (!project.secondLevelDomain ||
          domain.endsWith(
            `${getTopLevelDomain(domain)}/${project.secondLevelDomain}`
          ))
    )
    .map((project) => {
      const destination = `${application}/${newDomain}/${project.type}`;
      logger.info(`Moving library ${project.name} to ${destination}`);
      return {
        projectName: project.name,
        destination,
        updateImportPath: true,
      };
    });
};
