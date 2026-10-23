import { mergeAttributes } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import { normalizeInternalLinkAttributes } from "../../utils/internalLinks";

export const InternalLink = Link.extend({
  renderHTML({ HTMLAttributes }) {
    const attributes = mergeAttributes(
      this.options.HTMLAttributes,
      HTMLAttributes
    );

    normalizeInternalLinkAttributes(attributes);

    return ["a", attributes, 0];
  },
});
