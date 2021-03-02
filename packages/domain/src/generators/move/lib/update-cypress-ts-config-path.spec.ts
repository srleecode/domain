import { Tree, readJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { getTsConfigPath } from '../../shared/utils/tsconfig';
import { updateCypressTsConfigPath } from './update-cypress-ts-config-path';

describe('updateCypressTsConfigPath', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'domain';
  const newDomain = 'new-domain';

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    appTree.write(
      getTsConfigPath(appTree),
      JSON.stringify({
        compilerOptions: {
          paths: {
            [`@cypress/${application}/${domain}`]: [
              `libs/${application}/${domain}/.cypress/src/public-api.ts`,
            ],
          },
        },
      })
    );
  });

  it('should replace domain path config', () => {
    updateCypressTsConfigPath(appTree, application, domain, newDomain);
    const json = readJson(appTree, getTsConfigPath(appTree));
    expect(json).toEqual({
      compilerOptions: {
        paths: {
          '@cypress/test-application/new-domain': [
            'libs/test-application/new-domain/.cypress/src/public-api.ts',
          ],
        },
      },
    });
  });
});
