import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { NxJson, updateJsonInTree } from '@nrwl/workspace';
import { moveSchematic } from '@nrwl/workspace/src/generators/move/move';
import {
  getCypressProjectName,
  isHavingCypressProject,
} from '../../../utils/cypress-project';
import { getParsedDomain } from '../../../utils/domain';
import { CypressProject } from '../../shared/model/cypress-project.enum';

export const moveCypressProject = (
  application: string,
  domain: string,
  newDomain: string,
  projectType: CypressProject,
  tree: Tree
): Rule[] => {
  if (
    isHavingCypressProject(application, domain, CypressProject.E2E, tree) &&
    isHavingCypressProject(application, domain, CypressProject.Storybook, tree)
  ) {
    // if having both cypress project types update config files but dont remove the folder as the other cypress project uses it
    return [updateNxJson(application, domain, newDomain, projectType)];
  } else {
    return [
      moveSchematic({
        projectName: `${projectType}-${application}-${getParsedDomain(domain)}`,
        destination: `${projectType}/${application}/${newDomain}`,
        updateImportPath: true,
      }),
    ];
  }
};

/**
 * Updates the nx.json file to remove the project
 *
 * @param schema The options provided to the schematic
 */
function updateNxJson(
  application: string,
  domain: string,
  newDomain: string,
  projectType: CypressProject
) {
  return updateJsonInTree<NxJson>('nx.json', (json) => {
    const projectName = getCypressProjectName(application, domain, projectType);
    const newProjectName = getCypressProjectName(
      application,
      newDomain,
      projectType
    );
    const clonedJson = Object.assign({}, json);
    const oldProject = clonedJson[projectName];
    delete clonedJson[projectName];
    clonedJson[newProjectName] = oldProject;
    clonedJson[newProjectName].implicitDependencies = clonedJson[
      newProjectName
    ].implicitDependencies.map((dependency) =>
      dependency.replace(getParsedDomain(domain), getParsedDomain(newDomain))
    );
    return clonedJson;
  });
}
