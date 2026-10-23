export interface PostDetail {
  id: string;
  title: string;
  slug: string;
  meta: string;
  category:string;
  tags: string[];
  thumbnail?: string;
  createdAt: string;
  isDraft?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  isDirectPost?: boolean;
  faqs?: { question: string; answer: string }[];
  postAuthorId?: string;
  keywords?: string;
}

export interface IncomingPost {
  title: string;
  content: string;
  slug: string;
  meta: string;
  tags: string;
  category:string;
  focusKeyword?: string;
  thumbnailUrl?: string;
  isFeatured?: string;
  isDirectPost?: string;
  faqs?: string;
  postAuthorId?: string;
  keywords?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | undefined;
  role: "user" | "admin";
}

export type replyComments = CommentResponse[];
export interface CommentResponse {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  likedByOwner?: boolean;
  replies?: replyComments;
  repliedTo?: string;
  chiefComment: boolean;
  owner: { name: string; id: string; avatar?: string };
}

export interface LatestComment {
  id: string;
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  belongsTo: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface LatestUserProfile {
  id: string;
  name: string;
  avatar?: string;
  provider: string;
  email: string;
}
// Define the type for product data, separate from the ProductItem component
export interface ProductItemType {
  id: string;
  title: string;
  slug: string;
  meta: string;
  image?: string;
}
export interface OrderDetail {
  id: string;
  customerName: string;
  createdAt: string;
  total: number;
  status: string;
}
