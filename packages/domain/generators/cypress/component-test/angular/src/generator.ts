import {
  convertNxGenerator,
  formatFiles,
  logger,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { SetupComponentTestGeneratorSchema } from './schema';
import { setupCtGenerator } from '@jscutlery/cypress-angular/src/generators/setup-ct/setup-ct';
import { addComponentTestingTarget } from './lib/add-component-testing-target';
import { addTestFiles } from './lib/add--test-files';
import { removeSampleTest } from './lib/remove-sample-test';
import { includeCypressMountSupport } from './lib/include-cypress-mount-import';
import { addCypressVideoScreenshotsDefaults } from './lib/add-cypress-video-screen-shots-defaults';

export async function setupComponentTestGenerator(
  tree: Tree,
  options: SetupComponentTestGeneratorSchema
): Promise<void> {
  const { projectName } = options;
  await setUpComponentTests(tree, projectName);
  removeSampleTest(tree, projectName);
  addTestFiles(tree, options);
  addComponentTestingTarget(tree, projectName);
  includeCypressMountSupport(tree, projectName);
  addCypressVideoScreenshotsDefaults(tree, projectName);
  await formatFiles(tree);
}

const setUpComponentTests = async (
  tree: Tree,
  projectName: string
): Promise<void> => {
  // TODO remove once the @jscutlery is updated to use nx 13
  let isProjectsAdded = false;
  updateJson(tree, 'nx.json', (json) => {
    if (!json.projects) {
      isProjectsAdded = true;
      json.projects = {};
    }
    return json;
  });
  await setupCtGenerator(tree, {
    project: projectName,
  }).catch((e: Error) => {
    logger.error(e.message);
    logger.error(e.stack);
    throw e;
  });
  if (isProjectsAdded) {
    updateJson(tree, 'nx.json', (json) => {
      delete json.projects;
      return json;
    });
  }
};
export default setupComponentTestGenerator;

export const setupComponentTestSchematic = convertNxGenerator(
  setupComponentTestGenerator
);
