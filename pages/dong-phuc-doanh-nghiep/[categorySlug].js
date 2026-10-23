import { ENTERPRISE_FLAT_SLUGS } from '../../lib/enterpriseFlatSlugs';

// Không còn trang con riêng theo /dong-phuc-doanh-nghiep/[categorySlug] — mỗi
// dòng sản phẩm nay có URL phẳng 1 cấp riêng (vd /dong-phuc-polo, xem
// lib/enterpriseFlatSlugs.js). Giữ redirect 301 để không mất SEO/backlink của
// các URL cũ /dong-phuc-doanh-nghiep/[categorySlug] đã tồn tại trước đó.
export default function EnterpriseCategoryRedirect() {
  return null;
}

export async function getServerSideProps({ params }) {
  const { categorySlug } = params;
  const flatSlug = ENTERPRISE_FLAT_SLUGS[categorySlug];

  if (!flatSlug) {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: `/${flatSlug}`,
      permanent: true,
    },
  };
}
