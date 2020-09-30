import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { deleteInTree } from '../../../utils/tree';
import {
  isParentDomain,
  isChildDomain,
  getTopLevelDomain,
  getSecondLevelDomain,
} from '../../../utils/domain';
import { timer, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export const deleteDomainFolder = (
  application: string,
  domain: string
): Rule => (tree: Tree, context: SchematicContext): Observable<Tree> =>
  // adding a timeout as there is an intermittent issue where the remove project hasn't completed yet when the domain folder delete is attempted
  // This means it tried to delete a folder that has files and it gives an error. https://github.com/angular/angular-cli/issues/11460
  timer(800).pipe(
    map(() => {
      deleteInTree(tree, `libs/${application}/${domain}`);
      const topLevelDomain = getTopLevelDomain(domain);
      if (isChildDomain(domain) || isParentDomain(domain)) {
        if (
          tree
            .getDir(`libs/${application}/${topLevelDomain}`)
            .subdirs.filter((path) => path !== getSecondLevelDomain(domain))
            .length === 0
        ) {
          deleteInTree(tree, `libs/${application}/${topLevelDomain}`);
        }
      }
      return tree;
    }),
    take(1)
  );
