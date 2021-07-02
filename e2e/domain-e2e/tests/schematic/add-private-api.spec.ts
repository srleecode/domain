import { runNxCommandAsync, checkFilesExist } from '@nrwl/nx-plugin/testing';

describe('domain', () => {
  describe('privateApi', () => {
    it('should create index file', async () => {
      const application = 'test-application';
      const domain = 'jest-junit-reporter';
      const library = 'data-access';
      await runNxCommandAsync(
        `generate @srleecode/domain:privateApi --application ${application} --domain ${domain} --library ${library}`
      );

      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/${library}/src/private-api.ts`
        )
      ).not.toThrow();

    }, 120000);
  });
});
