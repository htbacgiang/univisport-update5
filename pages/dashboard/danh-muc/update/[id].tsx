import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import CategoryArticleEditor, {
  CategoryArticleFormValue,
} from "../../../../components/editor/CategoryArticleEditor";
import AdminLayout from "../../../../components/layout/AdminLayout";
import db from "../../../../utils/db";
import CategoryArticle from "../../../../models/CategoryArticle";
import { FileText } from "lucide-react";

type Props = {
  article: CategoryArticleFormValue;
};

const UpdateCategoryArticle: NextPage<Props> = ({ article }) => {
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (value: CategoryArticleFormValue) => {
    if (!value.content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết");
      return;
    }

    setUpdating(true);
    try {
      await axios.patch(`/api/category-articles/${article.id}`, value);
      toast.success("Đã cập nhật bài viết danh mục");
      router.push("/dashboard/danh-muc");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Cập nhật bài viết thất bại");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout title="Sửa bài viết danh mục">
      <div className="min-h-screen bg-[#f8fafc] p-6">
        <div className="mb-5 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#105d97]" />
          <h1 className="m-0 text-[1.375rem] font-bold text-[#0f172a]">
            Sửa bài viết danh mục
          </h1>
        </div>
        <CategoryArticleEditor
          initialValue={article}
          onSubmit={handleSubmit}
          busy={updating}
          buttonTitle="Cập nhật"
        />
      </div>
    </AdminLayout>
  );
};

export default UpdateCategoryArticle;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return {
      redirect: { destination: "/dang-nhap", permanent: false },
    };
  }

  try {
    await db.connectDb();
    const id = context.params?.id as string;
    const article = await CategoryArticle.findById(id).lean();
    if (!article) return { notFound: true };

    return {
      props: {
        article: {
          id: article._id.toString(),
          title: article.title || "",
          categorySlug: article.categorySlug || "",
          content: article.content || "",
          faqs: Array.isArray(article.faqs)
            ? article.faqs.map((faq: any) => ({
                question: faq.question || "",
                answer: faq.answer || "",
              }))
            : [],
          postAuthorId: article.postAuthor ? article.postAuthor.toString() : "",
        },
      },
    };
  } catch {
    return { notFound: true };
  }
};
