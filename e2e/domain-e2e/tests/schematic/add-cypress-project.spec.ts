import {
  runNxCommandAsync,
  readJson,
  checkFilesExist,
  readFile,
} from '@nrwl/nx-plugin/testing';

describe('domain', () => {
  describe('addCypressProject', () => {
    it('should add e2e project using existing domain', async (done) => {
      const application = 'test-application';
      const domain = 'jest-junit-reporter';
      await runNxCommandAsync(
        `generate @srleecode/domain:addCypressProject --application ${application} --domain ${domain}`
      );

      const nxJson = readJson('nx.json');
      const workspaceJson = readJson('workspace.json');
      const projectName = `e2e-${application}-${domain}`;
      expect(nxJson.projects[projectName]).toBeDefined();
      expect(workspaceJson.projects[projectName]).toBeDefined();
      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/.cypress/src/support/index.ts`
        )
      ).not.toThrow();
      done();
    }, 90000);
    it('should add storybook project using existing domain', async (done) => {
      const application = 'test-application';
      const domain = 'jest-junit-reporter';
      await runNxCommandAsync(
        `generate @srleecode/domain:addCypressProject --application ${application} --domain ${domain} --projectType=storybook`
      );
      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/.cypress/src/support/index.ts`
        )
      ).not.toThrow();

      done();
    }, 90000);

    it('should add implicit dependencies for all libraries in domain', async (done) => {
      const application = 'test-application';
      const domain = 'multiple-library-domain';
      await runNxCommandAsync(
        `generate @srleecode/domain:addCypressProject --application ${application} --domain ${domain}`
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
      done();
    }, 90000);
  });
});
