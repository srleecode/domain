import { Rule, Tree } from '@angular-devkit/schematics';
import { getProjects } from '../../../utils/domain';
import { getExternalSchematic } from '../../../utils/testing';
import { Project } from '../../shared/model/project.model';
import { deleteDomainFolder } from '../../shared/rule/delete-domain-folder';

export const removeDomain = (
  application: string,
  domain: string,
  tree: Tree
): Rule[] => {
  const projects = getProjects(application, domain, tree);
  return getRemoveRules(application, domain, projects);
};

const getRemoveRules = (
  application: string,
  domain: string,
  projects: Project[]
): Rule[] => {
  const rules = [];
  projects.forEach((project) =>
    rules.push(
      getExternalSchematic('@nrwl/workspace', 'remove', {
        projectName: project.name,
      })
    )
  );
  rules.push(deleteDomainFolder(application, domain));
  return rules;
};
