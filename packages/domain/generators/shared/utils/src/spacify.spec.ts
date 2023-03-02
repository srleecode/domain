import { spacify } from './spacify';

describe('spacify', () => {
  it('should return given words seperated by space and first letter capitalised', () => {
    expect(spacify('action_name')).toBe('Action Name');
    expect(spacify('css-class-name')).toBe('Css Class Name');
    expect(spacify('my favorite items')).toBe('My Favorite Items');
  });
  it('should only add space when there is one upper case letter', () => {
    expect(spacify('innerHTML')).toBe('Inner HTML');
  });
});
