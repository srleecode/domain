import { logger } from '@nx/devkit';
import { createProject } from '../../../utils/util';
import { checkFilesExist, runNxCommandAsync } from '@nx/plugin/testing';

describe('application-layer', () => {
  const groupingFolder = 'libs/ng-test-app/test-domain';
  beforeAll(async () => {
    createProject();
    await runNxCommandAsync(`generate @srleecode/domain:ng-add`);
    await runNxCommandAsync(
      `generate @srleecode/domain:appGroupingFolder --name test-app --applicationType ng`
    );
    await runNxCommandAsync(
      `generate @srleecode/domain:domainGroupingFolder --name test-domain --groupingFolder libs/ng-test-app`
    );
  }, 240000);

  it('should create application layer library', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:ngApplicationLayer --groupingFolder ${groupingFolder}`
    ).catch((e) => {
      logger.error(e.message);
      logger.error(e.stack);
      throw e;
    });
    checkFilesExist(`${groupingFolder}/application/src/index.ts`);
  });
});
