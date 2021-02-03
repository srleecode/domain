import { Rule, Tree } from '@angular-devkit/schematics';
import { moveSchematic } from '@nrwl/workspace/src/generators/move/move';
import {
  getProjects,
  getParsedDomain,
  getTopLevelDomain,
} from '../../../utils/domain';
import { Project } from '../../shared/model/project.model';

export const moveDomain = (
  application: string,
  domain: string,
  newDomain: string,
  tree: Tree
): Rule[] => {
  const projects = getProjects(application, domain, tree);
  return getMoveRules(application, domain, newDomain, projects);
};

const getMoveRules = (
  application: string,
  domain: string,
  newDomain: string,
  projects: Project[]
): Rule[] => {
  const rules = [];
  projects.forEach((project) => {
    const topLevelDomain = getTopLevelDomain(domain);
    if (
      project.name.startsWith(`${application}-${getParsedDomain(domain)}`) &&
      (!project.secondLevelDomain ||
        domain.endsWith(`${topLevelDomain}/${project.secondLevelDomain}`))
    )
      rules.push(
        moveSchematic({
          projectName: project.name,
          destination: `${application}/${newDomain}/${project.type}`,
          updateImportPath: true,
        })
      );
  });

  return rules;
};
