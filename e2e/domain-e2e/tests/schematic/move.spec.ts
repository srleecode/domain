import {
  runNxCommandAsync,
  checkFilesExist,
  readJson,
} from '@nrwl/nx-plugin/testing';

describe('domain', () => {
  const application = 'test-application';
  describe('move', () => {
    const moveDomain = async (
      domain: string,
      newDomain: string,
      libraryTypes = ['data-access']
    ) => {
      await runNxCommandAsync(
        `generate @srleecode/domain:move --application ${application} --domain ${domain} --newDomain ${newDomain}`
      );
      libraryTypes.forEach((type) =>
        expect(() =>
          checkFilesExist(
            `libs/${application}/${newDomain}/${type}/src/index.ts`
          )
        ).not.toThrow()
      );
    };
    it('should move leaf domain to new leaf domain', async (done) => {
      await moveDomain('leaf-domain', 'new-leaf-domain');
      done();
    }, 45000);
    it('should move leaf domain to child domain', async (done) => {
      await moveDomain('new-leaf-domain', 'parent-domain/new-child-domain');
      done();
    }, 45000);
    it('should move child domain to leaf domain', async (done) => {
      await moveDomain('parent-domain/new-child-domain', 'leaf-domain');
      done();
    }, 45000);
    it('should move leaf domain to parent domain', async (done) => {
      await moveDomain('leaf-domain', 'new-parent-domain/shared');
      done();
    }, 45000);
    it('should move parent domain with no children to leaf domain', async (done) => {
      await moveDomain('new-parent-domain/shared', 'leaf-domain');
      done();
    }, 45000);
    it('should move child domain to child domain', async (done) => {
      await moveDomain(
        'parent-domain-with-child/child-domain',
        'parent-domain-with-child/new-child-domain'
      );
      done();
    }, 45000);
    it('should move child domain to parent domain', async (done) => {
      await moveDomain(
        'parent-domain-with-child/new-child-domain',
        'new-parent-domain/shared'
      );
      done();
    }, 45000);
    it('should move parent domain with no children to child domain', async (done) => {
      await moveDomain(
        'new-parent-domain/shared',
        'parent-domain-with-child/child-domain'
      );
      done();
    }, 45000);
    it('should move parent domain with no children to new parent domain', async (done) => {
      await moveDomain('parent-domain/shared', 'new-parent-domain/shared');
      done();
    }, 45000);
    it('should move parent domain with children to new parent domain', async (done) => {
      const domain = 'parent-domain-with-child/shared';
      const newDomain = 'new-parent-domain-with-child/shared';
      await runNxCommandAsync(
        `generate @srleecode/domain:move --application ${application} --domain ${domain} --newDomain ${newDomain}`
      );
      expect(() =>
        checkFilesExist(
          `libs/${application}/${newDomain}/data-access/src/index.ts`
        )
      ).not.toThrow();
      done();
    }, 45000);
    it('should move e2e project when moving domain with e2e project', async (done) => {
      const domain = 'extra-options-test-domain/shared';
      const newDomain = 'new-extra-options-test-domain/shared';
      await runNxCommandAsync(
        `generate @srleecode/domain:move --application ${application} --domain ${domain} --newDomain ${newDomain}`
      );
      expect(() =>
        checkFilesExist(`libs/${application}/${newDomain}/feature/src/index.ts`)
      ).not.toThrow();
      const nxJson = readJson('nx.json');
      const workspaceJson = readJson('workspace.json');
      const cypressJson = readJson(
        `apps/e2e/${application}/${newDomain}/cypress.json`
      );
      const projectName = `e2e-${application}-new-extra-options-test-domain-shared`;
      expect(nxJson.projects[projectName]).toBeDefined();
      expect(workspaceJson.projects[projectName]).toBeDefined();
      expect(cypressJson).toEqual({
        ...cypressJson,
        fixturesFolder: `/libs/${application}/${newDomain}/.e2e/fixtures`,
        integrationFolder: `/libs/${application}/${newDomain}/.e2e/integration`,
        pluginsFile: `/libs/${application}/${newDomain}/.cypress/plugins/index`,
        supportFile: `/libs/${application}/${newDomain}/.cypress/support/index.ts`,
      });
      done();
    }, 45000);
  });
});
