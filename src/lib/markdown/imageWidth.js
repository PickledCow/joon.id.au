import { visit } from "unist-util-visit";

/**
 * @typedef {Object} ImageProperties
 * @property {string} [style]
 */

/**
 * @typedef {Object} ImageData
 * @property {ImageProperties} [hProperties]
 */

/**
 * @returns {(tree: import("mdast").Root) => void}
 */
export default function remarkImageWidth() {
  return (tree) => {
    visit(tree, "image", (node, index, parent) => {
      if (!parent || index === undefined) return;

      const next = parent.children[index + 1];

      if (
        !next ||
        next.type !== "text" ||
        !next.value.startsWith("{width=")
      ) {
        return;
      }

      const match = next.value.match(/^\{width=([^}]+)\}/);

      if (!match) return;

      const width = match[1];

      /** @type {ImageData} */
      const data = node.data ?? {};

      data.hProperties ??= {};
      data.hProperties.style = `width: ${width};`;

      node.data = data;

      next.value = next.value.slice(match[0].length);

      if (!next.value) {
        parent.children.splice(index + 1, 1);
      }
    });
  };
}