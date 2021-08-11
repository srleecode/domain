import { getNormalisedPath } from './get-normalised-path';

describe('getNormalisedPath', () => {
  it('should replace backslash with forward slash', async () => {
    expect(getNormalisedPath('test\\test')).toBe('test/test');
  });

  it('should replace double backslash with forward slash', async () => {
    expect(getNormalisedPath(`test\\\\test`)).toBe('test/test');
  });
});
