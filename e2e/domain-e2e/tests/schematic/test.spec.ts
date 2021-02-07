import { runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('test', () => {
  it('testing should not error for domain with e2e project', async (done) => {
    const out = await runNxCommandAsync(
      `test test-application-extra-options-test-domain-shared-feature`
    );
    expect(out.stderr).toBe('');
    expect(out.stdout).toContain('No tests found, exiting with code 0');
    done();
  }, 120000);
  it('testing should not error for domain with storybook project', async (done) => {
    const out = await runNxCommandAsync(
      `test test-application-storybook-domain-feature`
    );
    expect(out.stderr).toBe('');
    expect(out.stdout).toContain('No tests found, exiting with code 0');
    done();
  }, 120000);
});
