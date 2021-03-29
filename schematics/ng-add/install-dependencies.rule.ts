import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function installDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.addTask(new NodePackageInstallTask({packageName: 'lodash.get'}));
    context.addTask(new NodePackageInstallTask({packageName: 'lodash.set'}));
    context.addTask(new NodePackageInstallTask({packageName: 'lodash.merge'}));
    context.addTask(new NodePackageInstallTask({packageName: 'lodash.isequal'}));
    context.addTask(new NodePackageInstallTask({packageName: 'ts-debug'}));
    return tree;
  };
}
