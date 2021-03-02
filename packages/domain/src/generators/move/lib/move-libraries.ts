import { Tree } from '@nrwl/devkit';
import { moveGenerator } from '@nrwl/workspace';
import {
  getParsedDomain,
  getProjects,
  getTopLevelDomain,
} from '../../shared/utils/domain';

export const moveLibraries = async (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string
): Promise<void> => {
  const projects = getProjects(application, domain, tree);
  for (const project of projects) {
    const topLevelDomain = getTopLevelDomain(domain);
    if (
      project.name.startsWith(`${application}-${getParsedDomain(domain)}`) &&
      (!project.secondLevelDomain ||
        domain.endsWith(`${topLevelDomain}/${project.secondLevelDomain}`))
    ) {
      await moveGenerator(tree, {
        projectName: project.name,
        destination: `${application}/${newDomain}/${project.type}`,
        updateImportPath: true,
      });
    }
  }
};
