import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { getParsedDomain } from '../shared/utils/domain';
import { checkCypressProjectExists } from '../shared/validation/check-cypress-project-exists';
import { removeCypressProject } from './lib/remove-cypress-project';
import { RemoveCypressProjectGeneratorSchema } from './schema';

export function removeCypressProjectGenerator(
  tree: Tree,
  options: RemoveCypressProjectGeneratorSchema
): void {
  const { application, domain, projectType } = options;
  checkCypressProjectExists(tree, application, domain, projectType);
  logger.info(
    `Remove ${projectType} project from ${application}-${getParsedDomain(
      domain
    )}`
  );
  removeCypressProject(tree, application, domain, projectType);
}

export default removeCypressProjectGenerator;

export const removeCypressProjectSchematic = convertNxGenerator(
  removeCypressProjectGenerator
);
