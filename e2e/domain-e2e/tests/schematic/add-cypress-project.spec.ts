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
      const cypressJson = readJson(
        `apps/e2e/${application}/${domain}/cypress.json`
      );
      const tsConfigJson = readJson(
        `apps/e2e/${application}/${domain}/tsconfig.json`
      );
      const tsConfigE2EJson = readJson(
        `apps/e2e/${application}/${domain}/tsconfig.e2e.json`
      );
      const projectName = `e2e-${application}-${domain}`;
      expect(nxJson.projects[projectName]).toBeDefined();
      expect(workspaceJson.projects[projectName]).toBeDefined();
      expect(cypressJson.fixturesFolder).toBe(
        `../../../../libs/${application}/${domain}/.e2e/fixtures`
      );
      expect(cypressJson.integrationFolder).toBe(
        `../../../../libs/${application}/${domain}/.e2e/integration`
      );
      expect(cypressJson.pluginsFile).toBe(
        `../../../../libs/${application}/${domain}/.e2e/plugins/index`
      );
      expect(cypressJson.supportFile).toBe(
        `../../../../libs/${application}/${domain}/.e2e/support/index.ts`
      );
      expect(tsConfigJson.include).toEqual([
        `../../../../libs/${application}/${domain}/.e2e/**/*.ts`,
        `../../../../libs/${application}/${domain}/.e2e/**/*.js`,
        `../../../../libs/${application}/${domain}/.cypress/**/*.ts`,
        `../../../../libs/${application}/${domain}/.cypress/**/*.js`,
      ]);
      expect(tsConfigE2EJson.include).toBeUndefined();
      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/.cypress/support/index.ts`
        )
      ).not.toThrow();
      const eslintrc = readJson(`apps/e2e/${application}/${domain}/.eslintrc`);
      expect(eslintrc).toEqual({
        extends: ['../../../../.eslintrc'],
      });
      done();
    }, 30000);
    it('should add storybook project using existing domain', async (done) => {
      const application = 'test-application';
      const domain = 'jest-junit-reporter';
      await runNxCommandAsync(
        `generate @srleecode/domain:addCypressProject --application ${application} --domain ${domain} --projectType=storybook`
      );
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/.storybook/config.js`)
      ).not.toThrow();

      const tsConfigStorybookJson = readJson(
        `libs/${application}/${domain}/.storybook/tsconfig.json`
      );
      expect(tsConfigStorybookJson.exclude).toEqual([
        '../feature/**/*.spec.ts',
        '../ui/**/*.spec.ts',
      ]);
      expect(tsConfigStorybookJson.include).toEqual([
        '../feature/src/**/*',
        '../ui/src/**/*',
      ]);
      expect(tsConfigStorybookJson.compilerOptions.sourceMap).toBe(false);
      expect(tsConfigStorybookJson.compilerOptions.types).toEqual([]);
      const configJs = readFile(
        `libs/${application}/${domain}/.storybook/config.js`
      );
      expect(
        configJs
          .toString()
          .includes(
            `configure([require.context('../feature/src/lib', true, /\.stories\.js$/), require.context('../ui/src/lib', true, /\.stories\.js$/)], module);`
          )
      ).toBe(true);
      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/.cypress/support/index.ts`
        )
      ).not.toThrow();
      const addonsJs = readFile(
        `libs/${application}/${domain}/.storybook/addons.js`
      );
      expect(addonsJs.toString().trim()).toBe(
        "import '../../../../.storybook/addons';"
      );
      const cypressJson = readJson(
        `apps/storybook/${application}/${domain}/cypress.json`
      );
      expect(cypressJson.baseUrl).toBe('https://localhost:4400');
      done();
    }, 30000);

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
    }, 30000);
  });
});
