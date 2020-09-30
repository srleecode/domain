import { runNxCommandAsync, readJson, exists } from '@nrwl/nx-plugin/testing';

describe('domain', () => {
  describe('removeCypressProject', () => {
    it('should remove e2e project for domain', async (done) => {
      const application = 'test-application';
      const domain = 'jest-junit-reporter';
      await runNxCommandAsync(
        `generate @srleecode/domain:removeCypressProject --application ${application} --domain ${domain}`
      );

      const nxJson = readJson('nx.json');
      const workspaceJson = readJson('workspace.json');
      const projectName = `e2e-${application}-${domain}`;
      expect(nxJson.projects[projectName]).not.toBeDefined();
      expect(workspaceJson.projects[projectName]).not.toBeDefined();
      done();
    }, 30000);
  });
});
