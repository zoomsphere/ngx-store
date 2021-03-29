import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addImportToRootModule } from './add-import-to-root-module.rule';
import { installDependencies } from './install-dependencies.rule';
import { addConfigToIndex } from './add-config-to-index.rule';
import { createConfigFile } from './create-config-file.rule';

export function ngAdd(_options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      installDependencies(),
      addImportToRootModule(),
      createConfigFile(),
      addConfigToIndex(),
    ]);
  };
}
