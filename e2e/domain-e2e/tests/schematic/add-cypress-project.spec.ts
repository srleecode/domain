import {
  runNxCommandAsync,
  readJson,
  checkFilesExist,
  readFile,
} from '@nrwl/nx-plugin/testing';

describe('domain', () => {
  describe('cypressProject', () => {
    it('should add e2e project using existing domain', async () => {
      const application = 'test-application';
      const domain = 'jest-junit-reporter';
      await runNxCommandAsync(
        `generate @srleecode/domain:cypressProject --application ${application} --domain ${domain} --projectType=e2e --addComponentCommand true`
      );

      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/.cypress/src/support/index.ts`
        )
      ).not.toThrow();

    }, 120000);
    it('should add storybook project using existing domain', async () => {
      const application = 'test-application';
      const domain = 'jest-junit-reporter';
      await runNxCommandAsync(
        `generate @srleecode/domain:cypressProject --application ${application} --domain ${domain} --projectType=storybook --addComponentCommand true`
      );
      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/.cypress/src/support/index.ts`
        )
      ).not.toThrow();
      const workspaceJson = readJson('workspace.json');
      const projectName = `storybook-${application}-${domain}`;
      expect(Object.keys(workspaceJson.projects[projectName].targets)).toEqual([
        'storybook-e2e',
        'storybook',
        'build-storybook',
      ]);

    }, 120000);

    it('should add implicit dependencies for all libraries in domain', async () => {
      const application = 'test-application';
      const domain = 'multiple-library-domain';
      await runNxCommandAsync(
        `generate @srleecode/domain:cypressProject --application ${application} --domain ${domain} --addComponentCommand true`
      );

      const nxJson = readJson('nx.json');
      const projectName = `e2e-${application}-${domain}`;
      expect(nxJson.projects[projectName].implicitDependencies).toEqual([
        `${application}-${domain}-data-access`,
        `${application}-${domain}-feature`,
        `${application}-${domain}-shell`,
        `${application}-${domain}-ui`,
        `${application}-${domain}-util`,
      ]);

    }, 120000);
  });
});
