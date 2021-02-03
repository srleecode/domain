import { Rule, Tree } from '@angular-devkit/schematics';
import { removeSchematic } from '@nrwl/workspace/src/generators/remove/remove';
import { getProjects, isChildDomain } from '../../../utils/domain';
import { Project } from '../../shared/model/project.model';
import { deleteDomainFolder } from '../../shared/rule/delete-domain-folder';
import { removeParentDomainDependencyRule } from './remove-parent-domain-dependency';

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
      removeSchematic({
        projectName: project.name,
        skipFormat: false,
        forceRemove: false,
      })
    )
  );
  if (isChildDomain(domain)) {
    rules.push(removeParentDomainDependencyRule(application, domain));
  }
  rules.push(deleteDomainFolder(application, domain));
  return rules;
};
