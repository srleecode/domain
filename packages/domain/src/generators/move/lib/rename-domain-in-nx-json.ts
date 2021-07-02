import { Tree, updateJson } from '@nrwl/devkit';
// import { NxJson } from '@nrwl/workspace';
// import {readWorkspaceJson, readNxJson, readWorkspaceConfig} from '@nrwl/workspace';
import { getParsedDomain } from '../../shared/utils/domain';

export const renameDomainInNxJson = (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string
): void =>
  updateJson(tree, 'nx.json', (json) => {
    const domainProjects = Object.keys(json.projects).filter((project) =>
      project.startsWith(`${application}-${getParsedDomain(newDomain)}`)
    );
    domainProjects.forEach((project) => {
      json.projects[project].tags = json.projects[project].tags.map(
        (tag: string) => {
          if (tag.startsWith('scope:')) {
            return tag.replace(
              getParsedDomain(domain),
              getParsedDomain(newDomain)
            );
          }
          return tag;
        }
      );
    });
    return json;
  });
