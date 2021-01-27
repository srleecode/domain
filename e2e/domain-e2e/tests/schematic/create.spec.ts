import {
  checkFilesExist,
  runNxCommandAsync,
  ensureNxProject,
  readFile,
  readJson,
} from '@nrwl/nx-plugin/testing';

describe('domain', () => {
  beforeAll(() => {
    ensureNxProject('@srleecode/domain', 'dist/packages/domain');
  });
  describe('create', () => {
    it('should create leaf domain', async (done) => {
      const application = 'test-application';
      const domain = 'leaf-domain';
      await runNxCommandAsync(
        `generate @srleecode/domain:create --application ${application} --domain ${domain} --prefix srlee --libraries data-access`
      );

      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/data-access/src/index.ts`
        )
      ).not.toThrow();
      done();
    }, 120000);
    it('should create single library domain', async (done) => {
      const application = 'test-application';
      const domain = 'single-library-domain';
      await runNxCommandAsync(
        `generate @srleecode/domain:create --application ${application} --domain ${domain} --prefix srlee --libraries data-access --addE2EProject true`
      );

      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/data-access/src/index.ts`
        )
      ).not.toThrow();
      done();
    }, 120000);
    it('should create multiple library domain', async (done) => {
      const application = 'test-application';
      const domain = 'multiple-library-domain';
      await runNxCommandAsync(
        `generate @srleecode/domain:create --application ${application} --domain ${domain} --prefix srlee --libraries data-access,feature `
      );

      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/data-access/src/index.ts`
        )
      ).not.toThrow();
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/feature/src/index.ts`)
      ).not.toThrow();
      done();
    }, 120000);
    it('should add jest junit reporter when it is true', async (done) => {
      const application = 'test-application';
      const domain = 'jest-junit-reporter';
      await runNxCommandAsync(
        `generate @srleecode/domain:create --application ${application} --domain ${domain} --prefix srlee --libraries data-access,shell --addJestJunitReporter true --routing true --strict true --enableIvy true --buildable true`
      );
      const jestConfig = readFile(
        `libs/${application}/${domain}/data-access/jest.config.js`
      );
      expect(jestConfig.includes('reporters')).toBe(true);
      expect(jestConfig.includes('jest-junit')).toBe(true);
      done();
    }, 120000);
    it('should add E2E cypress project when it is true', async (done) => {
      const application = 'test-application';
      const domain = 'extra-options-test-domain/shared';
      await runNxCommandAsync(
        `generate @srleecode/domain:create --application ${application} --domain ${domain} --prefix srlee --libraries feature,ui --addE2EProject true --addComponentCommand true`
      );
      const nxJson = readJson('nx.json');
      const workspaceJson = readJson('workspace.json');
      const projectName = `e2e-${application}-extra-options-test-domain-shared`;
      expect(nxJson.projects[projectName]).toBeDefined();
      expect(workspaceJson.projects[projectName]).toBeDefined();
      done();
    }, 120000);
    it('should create mock file and resolution path when domain includes util library', async (done) => {
      const application = 'test-application';
      const domain = 'leaf-domain-with-util';
      await runNxCommandAsync(
        `generate @srleecode/domain:create --application ${application} --domain ${domain} --prefix srlee --libraries util`
      );

      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/util/src/testing.ts`)
      ).not.toThrow();
      done();
    }, 120000);
    it('should create child domain', async (done) => {
      const application = 'test-application';
      const parentDomain = 'parent-domain-with-child/shared';
      const childDomain = `parent-domain-with-child/child-domain`;
      await runNxCommandAsync(
        `generate @srleecode/domain:create --application ${application} --domain ${parentDomain} --prefix srlee --libraries data-access`
      );
      await runNxCommandAsync(
        `generate @srleecode/domain:create --application ${application} --domain ${childDomain} --prefix srlee --libraries data-access`
      );

      expect(() =>
        checkFilesExist(
          `libs/${application}/${parentDomain}/data-access/src/index.ts`
        )
      ).not.toThrow();
      expect(() =>
        checkFilesExist(
          `libs/${application}/${childDomain}/data-access/src/index.ts`
        )
      ).not.toThrow();
      done();
    }, 120000);
  });
  describe('createParent', () => {
    it('should create parent domain', async (done) => {
      const application = 'test-application';
      const domain = 'parent-domain/shared';
      await runNxCommandAsync(
        `generate @srleecode/domain:create --application ${application} --domain ${domain} --prefix srlee --libraries data-access`
      );

      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/data-access/src/index.ts`
        )
      ).not.toThrow();
      done();
    }, 120000);
  });
  describe('create with storybook project', () => {
    it('should create domain with storybook project', async (done) => {
      const application = 'test-application';
      const domain = 'storybook-domain';
      await runNxCommandAsync(
        `generate @srleecode/domain:create --application ${application} --domain ${domain} --prefix srlee --libraries data-access,feature,ui --addStorybookProject --addComponentCommand true`
      );
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/.cypress/tsconfig.json`)
      ).not.toThrow();
      done();
    }, 120000);
  });
  describe('create with both e2e and storybook project', () => {
    it('should create domain with storybook project', async (done) => {
      const application = 'test-application';
      const domain = 'both-cypress-projects-domain';
      await runNxCommandAsync(
        `generate @srleecode/domain:create --application ${application} --domain ${domain} --prefix srlee --libraries data-access,feature,ui --addStorybookProject true --addE2EProject true --addComponentCommand true`
      );
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/.cypress/cypress.json`)
      ).not.toThrow();
      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/.cypress/storybook-cypress.json`
        )
      ).not.toThrow();
      done();
    }, 120000);
  });
});
