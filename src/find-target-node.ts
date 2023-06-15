import { Node } from "unist";
import { isHtmlElementNode } from "./type-guards";
import { HtmlElementNode } from "./types";
import { NormalizedOptions } from "./options";

/**
 * Returns the target node, or the `<body>` node if there is no target.
 * The second node returned is the parent of the first node.
 */
export function findTargetNode(
  root: Node,
  location: string
): [HtmlElementNode, HtmlElementNode] {
  let [body, bodyParent] = findTagName(root, "body");
  let [target, targetParent] = findTagName(body || root, location);

  if (target) {
    return [target, targetParent || body || (root as HtmlElementNode)];
  }

  return [
    body || (root as HtmlElementNode),
    bodyParent || (root as HtmlElementNode),
  ];
}

/**
 * Recursively crawls the HAST tree and finds the first element with the specified tag name.
 */
function findTagName(
  node: Node,
  tagName: string
): [HtmlElementNode | undefined, HtmlElementNode | undefined] {
  if (isHtmlElementNode(node) && node.tagName === tagName) {
    return [node, undefined];
  }

  if (node.children) {
    let parent = node as HtmlElementNode;
    for (let child of parent.children!) {
      let [found] = findTagName(child, tagName);
      if (found) {
        return [found, parent];
      }
    }
  }

  return [undefined, undefined];
}
