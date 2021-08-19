import { convertNxGenerator, logger, Tree } from '@nrwl/devkit';
import { SetupComponentTestGeneratorSchema } from './schema';
import { setupCtGenerator } from '@jscutlery/cypress-angular/src/generators/setup-ct/setup-ct';
import { addComponentTestingTarget } from './lib/add-component-testing-target';
import { addComponentsTestFiles } from './lib/add-components--test-files';
import { removeSampleTest } from './lib/remove-sample-test';

export async function setupComponentTestGenerator(
  tree: Tree,
  options: SetupComponentTestGeneratorSchema
): Promise<void> {
  const { projectName } = options;
  await setupCtGenerator(tree, {
    project: projectName,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
  removeSampleTest(tree, projectName);
  addComponentsTestFiles(tree, options);
  addComponentTestingTarget(tree, projectName);
}

export default setupComponentTestGenerator;

export const setupComponentTestSchematic = convertNxGenerator(
  setupComponentTestGenerator
);
