import { LibraryDefinition } from '../model/library-definition.model';
import { StyleType } from '../model/style-type.enum';
import { addLibrariesRules } from './add-libraries';
import * as testingUtils from '../../../utils/testing';

describe('addLibrariesRules', () => {
  it('should get add library rules for given library definitions', () => {
    const projectName = 'projectName';
    const tags = ['testTag', 'testTag2'];
    const directory = 'testDirectory';
    const prefix = 'testPrefix';
    const style = StyleType.Scss;

    const libraryDefinitions: LibraryDefinition[] = [
      {
        projectName,
        tags,
        directory,
        prefix,
        style,
      },
    ];
    jest
      .spyOn(testingUtils, 'getExternalSchematic')
      .mockReturnValue(testingUtils.emptyRule);

    addLibrariesRules(libraryDefinitions);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/angular',
      'lib',
      {
        directory,
        linter: 'eslint',
        name: projectName,
        prefix,
        style,
        tags: `${tags[0]},${tags[1]}`,
      }
    );
  });
});
