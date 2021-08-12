import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export const addComponentTestingTarget = (
  tree: Tree,
  projectName: string,
  groupingFolder: string,
  libraryName: string
): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  projectConfig.targets = {
    ...projectConfig.targets,
    ct: {
      executor: '@nrwl/cypress:cypress',
      options: {
        cypressConfig: `${groupingFolder}/${libraryName}/cypress.json`,
        tsConfig: `${groupingFolder}/${libraryName}/tsconfig.cypress.json`,
        devServerTarget: '',
        testingType: 'component',
      },
    },
  };
  updateProjectConfiguration(tree, projectName, projectConfig);
};
