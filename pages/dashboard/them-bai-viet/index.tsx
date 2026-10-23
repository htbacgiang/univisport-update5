import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import Editor, { FinalPost } from "../../../components/editor";
import AdminLayout from "../../../components/layout/AdminLayout";
import { generateFormData } from "../../../utils/helper";

interface Props { }

const Create: NextPage<Props> = () => {
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (post: FinalPost) => {
    setCreating(true);
    try {
      const formData = generateFormData(post);
      const { data } = await axios.post("/api/posts", formData);
      toast.success("Bài viết mới đã được tạo thành công!");
      router.push("/dashboard/bai-viet/update/" + data.post.slug);
    } catch (error: any) {
      console.log(error.response.data);
      toast.error("Có lỗi xảy ra khi tạo bài viết mới!");
    }
    setCreating(false);
  };

  return (
    <AdminLayout title="Thêm bài viết mới">
      <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "1.5rem" }}>

        {/* Editor */}
        <div className="w-full">
          <Editor onSubmit={handleSubmit} busy={creating} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Create;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return {
      redirect: { destination: "/dang-nhap", permanent: false },
    };
  }

  return { props: {} };
}
