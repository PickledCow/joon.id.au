import { visit } from 'unist-util-visit';

export default function remarkImageWidth() {
  return (tree: any) => {
    visit(tree, 'image', (node: any, index: number | undefined, parent: any) => {
      if (!parent || index === undefined) return;

      const next = parent.children[index + 1];

      if (
        !next ||
        next.type !== 'text' ||
        !next.value.startsWith('{width=')
      ) {
        return;
      }

      const match = next.value.match(/^\{width=([^}]+)\}/);

      if (!match) return;

      const width = match[1];

      node.data ??= {};
      node.data.hProperties ??= {};
      node.data.hProperties.style = `width: ${width};`;

      next.value = next.value.slice(match[0].length);

      if (!next.value) {
        parent.children.splice(index + 1, 1);
      }
    });
  };
}