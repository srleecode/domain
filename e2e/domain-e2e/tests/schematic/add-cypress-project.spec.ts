import { runNxCommandAsync, readJson } from '@nrwl/nx-plugin/testing';

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
      const cypressJson = readJson(
        `apps/e2e/${application}/${domain}/cypress.json`
      );
      const projectName = `e2e-${application}-${domain}`;
      expect(nxJson.projects[projectName]).toBeDefined();
      expect(workspaceJson.projects[projectName]).toBeDefined();
      expect(cypressJson.fixturesFolder).toBe(
        `/libs/${application}/${domain}/.e2e/fixtures`
      );
      expect(cypressJson.integrationFolder).toBe(
        `/libs/${application}/${domain}/.e2e/integration`
      );
      expect(cypressJson.pluginsFile).toBe(
        `/libs/${application}/${domain}/.cypress/plugins/index`
      );
      expect(cypressJson.supportFile).toBe(
        `/libs/${application}/${domain}/.cypress/support/index.ts`
      );
      done();
    }, 45000);
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
    }, 45000);
  });
});
