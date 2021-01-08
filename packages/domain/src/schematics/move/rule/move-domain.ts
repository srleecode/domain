import { Rule, Tree } from '@angular-devkit/schematics';
import {
  getProjects,
  getParsedDomain,
  getTopLevelDomain,
} from '../../../utils/domain';
import { getExternalSchematic } from '../../../utils/testing';
import { Project } from '../../shared/model/project.model';

export const moveDomain = (
  application: string,
  domain: string,
  newDomain: string,
  tree: Tree
): Rule[] => {
  const projects = getProjects(application, domain, tree);
  return getMoveRules(application, domain, newDomain, projects, tree);
};

const getMoveRules = (
  application: string,
  domain: string,
  newDomain: string,
  projects: Project[],
  tree: Tree
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
        getExternalSchematic('@nrwl/workspace', 'move', {
          projectName: project.name,
          destination: `${application}/${newDomain}/${project.type}`,
        })
      );
  });

  return rules;
};
