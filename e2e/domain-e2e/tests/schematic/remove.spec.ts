import {
  runNxCommandAsync,
  checkFilesExist,
  readJson,
} from '@nrwl/nx-plugin/testing';

describe('domain', () => {
  const application = 'test-application';
  describe('remove', () => {
    const removeDomain = async (
      domain: string,
      libraryTypes = ['data-access']
    ) => {
      await runNxCommandAsync(
        `generate @srleecode/domain:remove --application ${application} --domain ${domain}`
      );
      libraryTypes.forEach((type) =>
        expect(() =>
          checkFilesExist(`libs/${application}/${domain}/${type}/src/index.ts`)
        ).toThrow()
      );
    };
    it('should remove leaf domain', async () => {
      await removeDomain('leaf-domain');

    }, 120000);
    it('should remove mock file resolution path when removing domain with util folder', async () => {
      const domain = 'leaf-domain-with-util';
      await removeDomain(domain);
      const tsConfig = readJson('tsconfig.base.json');
      expect(
        tsConfig.compilerOptions.paths[
          '@proj-test-application/new-leaf-domain/testing]'
        ]
      ).toBeUndefined();

    }, 120000);
    it('should remove parent domain with children', async () => {
      await removeDomain('new-parent-domain-with-child/shared');
      expect(() =>
        checkFilesExist(
          `libs/${application}/new-parent-domain-with-child/child-domain/data-access/src/index.ts`
        )
      ).toThrow();

    }, 120000);
    it('should remove parent domain with no children', async () => {
      await removeDomain('new-parent-domain/shared');
      expect(() =>
        checkFilesExist(
          `libs/${application}/new-parent-domain/shared/data-access/src/index.ts`
        )
      ).toThrow();

    }, 120000);
    it('should remove domain and e2e project when it contains multiple libraries and e2e project', async () => {
      const domain = 'new-extra-options-test-domain/shared';
      await removeDomain(domain);
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/feature/src/index.ts`)
      ).toThrow();

    }, 120000);
  });
});
