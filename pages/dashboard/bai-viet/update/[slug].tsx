import axios from "axios";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import { toast } from "react-toastify";
import Editor, { FinalPost } from "../../../../components/editor";
import AdminLayout from "../../../../components/layout/AdminLayout";
import db from "../../../../utils/db";
import Post from "../../../../models/Post";
import { generateFormData } from "../../../../utils/helper";
import { Pencil } from "lucide-react";

interface PostResponse extends FinalPost {
  id: string;
  isDraft?: boolean;
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Update: NextPage<Props> = ({ post }) => {
  const [updating, setUpdating] = useState(false);
  const handleSubmit = async (post: FinalPost) => {
    setUpdating(true);
    try {
      // we have to generate FormData
      const formData = generateFormData(post);

      // submit our post
      const { data } = await axios.patch("/api/posts/" + post.id, formData);
      toast.success("Cập nhật bài viết thành công!");
      console.log(data);
    } catch (error: any) {
      console.error("Lỗi khi cập nhật bài viết:", error.response?.data);
      const errMsg = error.response?.data?.error || "Có lỗi xảy ra khi cập nhật bài viết!";
      toast.error(errMsg);
    }
    setUpdating(false);
  };

  return (
    <AdminLayout title="Cập nhật bài viết">
      <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
          <Pencil style={{ width: 20, height: 20, color: "#105d97", flexShrink: 0 }} />
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
            Cập nhật bài viết
          </h1>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
          <Editor
            initialValue={post}
            onSubmit={handleSubmit}
            busy={updating}
            btnTitle="Cập nhật"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

interface ServerSideResponse {
  post: PostResponse;
}
export const getServerSideProps: GetServerSideProps<
  ServerSideResponse
> = async (context) => {
  try {
    const slug = context.query.slug as string;

        await db.connectDb();
    
    const post = await Post.findOne({ slug });
    if (!post) return { notFound: true };

    const { _id, meta, title, content, thumbnail, tags, category, isDraft, isFeatured, focusKeyword, isDirectPost, faqs, postAuthor, keywords } = post;

    return {
      props: {
        post: {
          id: _id.toString(),
          title,
          content,
          tags: tags.join(", "),
          thumbnail: thumbnail?.url || "",
          slug,
          category: category || "",
          meta,
          isDraft: isDraft || false,
          isFeatured: isFeatured || false,
          isDirectPost: isDirectPost || false,
          focusKeyword: focusKeyword || "",
          faqs: faqs ? faqs.map((faq: any) => ({ question: faq.question, answer: faq.answer })) : [],
          postAuthorId: postAuthor ? postAuthor.toString() : "",
          keywords: keywords || "",
        },
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default Update;
