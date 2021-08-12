import { Tree } from '@nrwl/devkit';
import { initialiseAngularWorkspace } from '../angular/initialise-angular-workspace';
import { ApplicationType } from '@srleecode/domain/grouping-folder/shared';
import { addEslintLayerConstraints } from './add-eslint-layer-constraints';

export const initialiseWorkspace = async (
  tree: Tree,
  applicationTye: ApplicationType
): Promise<void> => {
  addEslintLayerConstraints(tree);
  if (applicationTye === ApplicationType.Angular) {
    await initialiseAngularWorkspace(tree);
  }
};
