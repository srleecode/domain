import { Tree, updateJson } from '@nrwl/devkit';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

export const removeLibraryStorybookLintReference = (
  tree: Tree,
  application: string,
  domain: string,
  library: DomainLibraryName
): void =>
  updateJson(
    tree,
    `libs/${application}/${domain}/${library}/.eslintrc.json`,
    (json) => {
      json.overrides[0].parserOptions.project.splice(-1, 1);
      return json;
    }
  );
