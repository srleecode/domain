import { runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('lint', () => {
  it('linting should not error when all rules are followed for domain with e2e project', async (done) => {
    const out = await runNxCommandAsync(
      `lint test-application-extra-options-test-domain-shared-feature`
    );
    expect(out.stderr).toBe('');
    expect(out.stdout).toContain('All files pass linting');
    done();
  }, 120000);
  it('linting should not error when all rules are followed for domain with storybook project', async (done) => {
    const out = await runNxCommandAsync(
      `lint test-application-storybook-domain-data-access --lintFilePatterns=libs/test-application/storybook-domain/data-access/src/lib`
    );
    expect(out.stderr).toBe('');
    expect(out.stdout).toContain('All files pass linting');
    done();
  }, 120000);
});
