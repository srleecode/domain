import {
  checkFilesExist,
  runNxCommandAsync,
  updateFile,
} from '@nrwl/nx-plugin/testing';
import { EMPTY_ESLINT } from './model/empty-eslint.const';
import { createProject } from '../../utils/util';

describe('app grouping folder', () => {
  beforeAll(async () => {
    createProject();
    updateFile('.eslintrc.json', JSON.stringify(EMPTY_ESLINT));
    await runNxCommandAsync(`generate @srleecode/domain:ng-add`);
  });

  it('should create directory with language prefixed to name', async () => {
    await runNxCommandAsync(
      `generate @srleecode/domain:appGroupingFolder --name test-app --applicationType ng`
    );
    checkFilesExist('libs/ng-test-app');
  });
});
