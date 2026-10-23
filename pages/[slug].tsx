import { GetServerSideProps, NextPage } from "next";
import DefaultLayout from "../components/layout/DefaultLayout";
import db from "../utils/db";
import Post from "../models/Post";
import Author from "../models/Author";
import Feedback from "../models/Feedback";
import DirectPostView from "../components/layout/DirectPostView";

// ─── TYPES ──────────────────────────────────────────────────────────────────
type MetaData = {
  title: string;
  description: string;
  author: string;
  canonical: string;
  keywords?: string;
  robots?: string;
  og: {
    title: string;
    description: string;
    type: string;
    image: string;
    imageWidth: string;
    imageHeight: string;
    imageAlt: string;
    url: string;
    site_name: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  schema: object[];
};

type Props = {
  data: any;
  relatedData?: any;
};

const UnifiedSlugPage: NextPage<Props> = ({ data, relatedData }) => {
  return (
    <DefaultLayout>
      <DirectPostView post={data} randomFeedbacks={relatedData} />
    </DefaultLayout>
  );
};

export default UnifiedSlugPage;

// ─── SERVER SIDE PROPS ───────────────────────────────────────────────────────
export const getServerSideProps: GetServerSideProps<Props, { slug: string }> = async ({ params }) => {
  const slug = params?.slug as string;
  if (!slug) return { notFound: true };

  try {
    await db.connectDb();

    // Only handle DirectPost here. 
    // Categories like 'dong-phuc-gym' are handled by their own folders (pages/dong-phuc-gym/index.js).
    // Products are handled by pages/san-pham/[slug]/index.jsx.
    
    const _author = Author; // Register model
    const postDoc = await Post.findOne({ slug, isDirectPost: true }).populate("postAuthor").lean();
    if (postDoc) {
      const post = JSON.parse(JSON.stringify(postDoc));
      
      // Fetch random feedbacks for sidebar
      let randomFeedbacks: any[] = [];
      try {
        const feedbacksRaw = await Feedback.aggregate([
          { $sample: { size: 3 } },
          { $project: { _id: 1, title: 1, slug: 1, image: 1, customer: 1, category: 1 } }
        ]);
        randomFeedbacks = feedbacksRaw.map((fb: any) => ({
          id: fb._id.toString(),
          title: fb.title || "",
          slug: fb.slug || "",
          image: fb.image || "",
          customer: fb.customer || "",
          category: fb.category || ""
        }));
      } catch (fbError) {
        console.error("Error fetching random feedbacks:", fbError);
      }

      const canonicalUrl = `https://dongphucunivi.com/${slug}`;
      const postAuthor = post.postAuthor || { name: "Team SEO Univi" };
      const thumbnailUrl = post.thumbnail?.url || "https://dongphucunivi.com/images/banner-home-1.jpg";

      const meta: MetaData = {
        title: post.title,
        description: post.meta,
        author: postAuthor.name,
        canonical: canonicalUrl,
        keywords: post.tags?.join(", "),
        og: {
          title: post.title,
          description: post.meta,
          type: "article",
          image: thumbnailUrl,
          imageWidth: "1200",
          imageHeight: "630",
          imageAlt: post.title,
          url: canonicalUrl,
          site_name: "Đồng Phục Univi",
        },
        twitter: {
          card: "summary_large_image",
          title: post.title,
          description: post.meta,
          image: thumbnailUrl,
        },
        schema: [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://dongphucunivi.com" },
              { "@type": "ListItem", "position": 2, "name": post.title, "item": canonicalUrl },
            ],
          }
        ],
      };

      return { props: { data: post, meta, relatedData: randomFeedbacks } };
    }

    return { notFound: true };
  } catch (error) {
    console.error("Error in DirectPost getServerSideProps:", error);
    return { notFound: true };
  }
};
