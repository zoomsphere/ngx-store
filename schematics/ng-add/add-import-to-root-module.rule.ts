import { Rule, Tree } from '@angular-devkit/schematics';
import { RootModule } from '@ngx-ext/schematics-api';

export function addImportToRootModule(): Rule {
  return (tree: Tree) => {
    const rootModule = RootModule.getInstance(tree);
    rootModule.addImport('WebStorageModule.forRoot()', 'ngx-store');
    return rootModule.applyAllChanges();
  };
}
