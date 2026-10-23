import { FinalPost } from "../components/editor";
import { PostDetail } from "./types";

export const generateFormData = (post: FinalPost) => {
  const formData = new FormData();
  for (let key in post) {
    const value = (post as any)[key];
    if (value === undefined || value === null) continue;
    
    if (key === "tags" && typeof value === "string" && value.trim()) {
      const tags = value.split(",").map((tag: string) => tag.trim());
      formData.append("tags", JSON.stringify(tags));
    } else if (key === "meta") {
      let metaVal = typeof value === "string" ? value.trim() : "";
      if (!metaVal && post.content) {
        metaVal = post.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 160);
      }
      formData.append("meta", metaVal || post.title || "Bài viết Univisport");
    } else if (key === "thumbnail") {
      if (value instanceof File) {
        formData.append("thumbnail", value);
      } else if (typeof value === "string") {
        formData.append("thumbnailUrl", value);
      }
    } else if (key === "isFeatured") {
      formData.append("isFeatured", value ? "true" : "false");
    } else if (key === "isDirectPost") {
      formData.append("isDirectPost", value ? "true" : "false");
    } else if (key === "faqs") {
      formData.append("faqs", JSON.stringify(value || []));
    } else {
      formData.append(key, value);
    }
  }

  return formData;
};

export const filterPosts = (posts: PostDetail[], postToFilter: PostDetail) => {
  return posts.filter((post) => {
    return post.id !== postToFilter.id;
  });
};

export const trimText = (text: string, trimBy: number) => {
  if (text.length <= trimBy) return text;
  return text.substring(0, trimBy).trim() + "...";
};
