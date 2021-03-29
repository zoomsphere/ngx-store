import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';

export function addConfigToIndex(): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const fileName = './src/index.html';
        const content = tree.read(fileName)?.toString();
        if (!content) {
            throw new SchematicsException(`Couldn't find src/index.html file`);
        }
        const head = '<head>';
        const position = content.indexOf(head) + head.length;
        const template = `\n\t<script src="/assets/js/ngx-store.config.js"></script>`;
        const recorder = tree.beginUpdate(fileName);
        recorder.insertRight(position, template);
        tree.commitUpdate(recorder);
        return tree;
    };
}
