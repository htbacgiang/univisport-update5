import { Editor } from "@tiptap/react";

export const getFocusedEditor = (editor: Editor) => {
  return editor.chain().focus();
};

export const validateUrl = (url: string, slug: string = "") => {
  if (!url.trim()) return "";

  let finalUrl;

  try {
    finalUrl = new URL(url);
  } catch (error) {
    finalUrl = new URL("https://" + url);
  }

  if (slug) {
    finalUrl.pathname = slug;
  }

  return finalUrl.toString();
};
