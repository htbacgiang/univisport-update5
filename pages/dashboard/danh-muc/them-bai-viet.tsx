import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import CategoryArticleEditor, {
  CategoryArticleFormValue,
} from "../../../components/editor/CategoryArticleEditor";
import AdminLayout from "../../../components/layout/AdminLayout";
import { FileText } from "lucide-react";

const CreateCategoryArticle: NextPage = () => {
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (value: CategoryArticleFormValue) => {
    if (!value.content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết");
      return;
    }

    setCreating(true);
    try {
      await axios.post("/api/category-articles", value);
      toast.success("Đã tạo bài viết danh mục");
      router.push("/dashboard/danh-muc");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Tạo bài viết thất bại");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout title="Thêm bài viết danh mục">
      <div className="min-h-screen bg-[#f8fafc] p-6">
        <div className="mb-5 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#105d97]" />
          <h1 className="m-0 text-[1.375rem] font-bold text-[#0f172a]">
            Thêm bài viết danh mục
          </h1>
        </div>
        <CategoryArticleEditor
          onSubmit={handleSubmit}
          busy={creating}
          buttonTitle="Tạo bài viết"
        />
      </div>
    </AdminLayout>
  );
};

export default CreateCategoryArticle;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return {
      redirect: { destination: "/dang-nhap", permanent: false },
    };
  }

  return { props: {} };
}
