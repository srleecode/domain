import { readJsonInTree } from '@nrwl/workspace';
import {
  DomainConfig,
  DomainConfigProject,
} from '../schematics/shared/model/domain-config.model';
import { getParsedDomain } from './domain';
import { Tree } from '@angular-devkit/schematics';

export const getDomainProjectConfig = (
  tree: Tree,
  application: string,
  domain: string
): DomainConfigProject => {
  const domainConfig: DomainConfig = readJsonInTree(tree, 'domain.config.json');
  return domainConfig[`${application}-${getParsedDomain(domain)}`];
};
