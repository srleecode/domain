import { convertNxGenerator, formatFiles, logger, Tree } from '@nrwl/devkit';
import { SetupComponentTestGeneratorSchema } from './schema';
import { setupCtGenerator } from '@jscutlery/cypress-angular/src/generators/setup-ct/setup-ct';
import { addComponentTestingTarget } from './lib/add-component-testing-target';
import { addTestFiles } from './lib/add--test-files';
import { removeSampleTest } from './lib/remove-sample-test';
import { includeCypressMountSupport } from './lib/include-cypress-mount-import';

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
  addTestFiles(tree, options);
  addComponentTestingTarget(tree, projectName);
  includeCypressMountSupport(tree, projectName);
  await formatFiles(tree);
}

export default setupComponentTestGenerator;

export const setupComponentTestSchematic = convertNxGenerator(
  setupComponentTestGenerator
);
