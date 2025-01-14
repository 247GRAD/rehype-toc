import { Processor, Transformer } from "unified";
import { Node } from "unist";
import { createTOC } from "./create-toc";
import { customizationHooks } from "./customization-hooks";
import { findHeadings } from "./fiind-headings";
import { findTargetNode } from "./find-target-node";
import { insertTOC } from "./insert-toc";
import { NormalizedOptions, Options } from "./options";

/**
 * This is a Rehype plugin that adds a table of contents (TOC) that links to all
 * the `<h1>` - `<h6>` headings no the page.
 */
export function toc(this: Processor, opts?: Options): Transformer {
  let options = new NormalizedOptions(opts);

  return function transformer(root: Node): Node {
    // Find the target element
    let [mainNode] = findTargetNode(root, "main");
    let [targetNode, targetParent] = findTargetNode(root, options.location);

    // Find all heading elements
    let headings = findHeadings(mainNode, options);

    // Create the table of contents
    let tocNode = createTOC(headings, options);

    // Allow the user to customize the table of contents before we add it to the page
    let node = customizationHooks(tocNode, options);

    if (node) {
      // Add the table of contents to the target element
      insertTOC(node, targetNode, targetParent, options);
    }

    return root;
  };
}
