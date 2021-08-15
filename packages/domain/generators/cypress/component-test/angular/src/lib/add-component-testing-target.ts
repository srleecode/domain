import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export const addComponentTestingTarget = (
  tree: Tree,
  projectName: string
): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  projectConfig.targets = {
    ...projectConfig.targets,
    ct: {
      executor: '@nrwl/cypress:cypress',
      options: {
        cypressConfig: `${projectConfig.root}/cypress.json`,
        tsConfig: `${projectConfig.root}/tsconfig.cypress.json`,
        devServerTarget: '',
        testingType: 'component',
      },
    },
  };
  updateProjectConfiguration(tree, projectName, projectConfig);
};
