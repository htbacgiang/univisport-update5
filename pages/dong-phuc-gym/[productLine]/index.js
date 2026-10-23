import { productTaxonomy } from '../../../lib/productTaxonomy';

const CATEGORY_SLUG = 'dong-phuc-gym';

// Không còn trang con riêng cho từng dòng sản phẩm — Đồng phục Gym chỉ lọc
// ngay trên /dong-phuc-gym qua query ?line=. Giữ redirect 301 để không mất
// SEO/backlink của các URL /dong-phuc-gym/[productLine] đã tồn tại trước đó.
export default function GymProductLineRedirect() {
  return null;
}

export async function getServerSideProps({ params }) {
  const { productLine } = params;
  const lineConfig = productTaxonomy[CATEGORY_SLUG]?.productLines?.[productLine];

  if (!lineConfig) {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: `/${CATEGORY_SLUG}?line=${productLine}`,
      permanent: true,
    },
  };
}
