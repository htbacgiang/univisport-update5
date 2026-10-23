import DefaultLayout from "../../../components/layout/DefaultLayout";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import ProductDetailView from "../../../components/univisport/ProductDetailView";
import { getProductLineLabel } from "../../../lib/productTaxonomy";
import { ENTERPRISE_FLAT_SLUGS } from "../../../lib/enterpriseFlatSlugs";

// ─── CATEGORY NAMES MAP ──────────────────────────────────────────────────────
const CATEGORY_NAMES = {
  'dong-phuc-gym': 'Đồng Phục Gym',
  'dong-phuc-yoga-pilates': 'Đồng Phục Yoga',
  'dong-phuc-pilates': 'Đồng Phục Pilates',
  'dong-phuc-pickleball': 'Đồng Phục Pickleball',
  'dong-phuc-ao-gio': 'Đồng Phục Áo Gió',
  'dong-phuc-ao-polo': 'Đồng Phục Áo Polo',
  'dong-phuc-ao-thun': 'Đồng Phục Áo Thun',
  'dong-phuc-golf-tennis': 'Đồng Phục Golf - Tennis',
  'dong-phuc-chay-bo': 'Đồng Phục Chạy Bộ',
  'dong-phuc-mma': 'Đồng Phục MMA',
  'dong-phuc-doanh-nghiep': 'Đồng Phục Doanh Nghiệp',
};

const ENTERPRISE_CATEGORY_SLUG = 'dong-phuc-doanh-nghiep';

const ProductDetailPage = ({ product, relatedProducts, meta }) => {
  return (
    <DefaultLayout meta={meta}>
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    </DefaultLayout>
  );
};

export default ProductDetailPage;

export async function getServerSideProps({ params }) {
  const slug = params?.slug;
  if (!slug) return { notFound: true };

  try {
    await db.connectDb();
    const productDoc = await Product.findOne({ slug }).lean();
    if (!productDoc) return { notFound: true };

    const product = JSON.parse(JSON.stringify(productDoc));

    // Fetch related products (lấy ngẫu nhiên sản phẩm trong danh mục / productLine)
    const relatedFilter = {
      category: product.category,
      slug: { $ne: slug },
      visibleOnArticle: { $ne: false },
    };
    if (product.productLine) {
      relatedFilter.productLine = product.productLine;
    }

    let relatedProductsDocs = [];
    try {
      relatedProductsDocs = await Product.aggregate([
        { $match: relatedFilter },
        { $sample: { size: 8 } },
      ]);

      if ((!relatedProductsDocs || relatedProductsDocs.length === 0) && product.productLine) {
        relatedProductsDocs = await Product.aggregate([
          { $match: { category: product.category, slug: { $ne: slug }, visibleOnArticle: { $ne: false } } },
          { $sample: { size: 8 } },
        ]);
      }
    } catch (_) {
      relatedProductsDocs = await Product.find(relatedFilter)
        .sort({ displayOrder: 1, createdAt: -1 })
        .limit(8)
        .lean();
    }

    const relatedProducts = relatedProductsDocs.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      maxPrice: p.originalPrice || p.price,
      discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
      image: p.colors?.[0]?.image || p.image || '',
      slug: p.slug || '',
    }));

    const categoryNameVN = product.categoryNameVN || CATEGORY_NAMES[product.category] || 'Đồng Phục';
    const canonicalUrl = `https://dongphucunivi.com/san-pham/${slug}`;

    // Đồng phục Doanh nghiệp có thêm 1 tầng category con (productLine) giữa category
    // và sản phẩm — chỉ áp dụng riêng cho category này, không ảnh hưởng breadcrumb
    // của Gym hay các category khác (vẫn giữ nguyên 2 tầng như hiện tại).
    const isEnterpriseProduct = product.category === ENTERPRISE_CATEGORY_SLUG && product.productLine;
    const enterpriseLineLabel = isEnterpriseProduct
      ? getProductLineLabel(ENTERPRISE_CATEGORY_SLUG, product.productLine)
      : '';

    const displayCategorySlug = isEnterpriseProduct
      ? (ENTERPRISE_FLAT_SLUGS[product.productLine] || `${product.category}/${product.productLine}`)
      : product.category;

    const displayCategoryName = isEnterpriseProduct && enterpriseLineLabel
      ? enterpriseLineLabel
      : categoryNameVN;

    const breadcrumbListItems = [
      { '@type': 'ListItem', 'position': 1, 'name': 'Trang chủ', 'item': 'https://dongphucunivi.com/' },
      { '@type': 'ListItem', 'position': 2, 'name': displayCategoryName, 'item': `https://dongphucunivi.com/${displayCategorySlug}` },
      { '@type': 'ListItem', 'position': 3, 'name': product.name, 'item': canonicalUrl },
    ];
    const normalizeImgUrl = (url) => {
      if (!url || typeof url !== 'string') return '';
      const trimmed = url.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
      return `https://dongphucunivi.com${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
    };

    const rawCandidateImages = [
      product.image,
      ...(Array.isArray(product.colors) ? product.colors.map((c) => c?.image) : []),
      ...(Array.isArray(product.gallery) ? product.gallery.map((g) => g?.src) : []),
    ];

    const cleanProductImages = Array.from(
      new Set(
        rawCandidateImages
          .map(normalizeImgUrl)
          .filter(Boolean)
      )
    );

    const finalImages = cleanProductImages.length > 0
      ? cleanProductImages
      : ['https://dongphucunivi.com/images/banner-1.webp'];

    const productImage = finalImages[0];
    const validFaqs = Array.isArray(product.faqs)
      ? product.faqs
        .map((faq) => ({
          question: faq.question?.trim() || '',
          answer: faq.answer?.trim() || '',
        }))
        .filter((faq) => faq.question && faq.answer)
      : [];
    product.faqs = validFaqs;

    const numericPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price);
    const hasValidPrice = Number.isFinite(numericPrice) && numericPrice > 0;
    const numericOriginalPrice = typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(product.originalPrice);
    const hasOriginalPrice = Number.isFinite(numericOriginalPrice) && numericOriginalPrice > numericPrice;

    const productSizes = Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : ['S', 'M', 'L', 'XL', '2XL', '3XL'];

    const colorNames = Array.isArray(product.colors)
      ? product.colors.map((c) => c.name?.trim()).filter(Boolean)
      : [];

    const materialValue = product.material?.trim() || 'Vải thể thao UNI DRY cao cấp (thoáng khí, co giãn 4 chiều, chống UV)';

    const productVariants = Array.isArray(product.colors) && product.colors.length > 0
      ? product.colors.map((colorObj, idx) => {
          const colorImg = normalizeImgUrl(colorObj.image) || productImage;
          const variantSku = `${product.maSanPham || `SP${product._id}`}-${colorObj.name ? colorObj.name.replace(/\s+/g, '-').toUpperCase() : `V${idx + 1}`}`;
          return {
            '@type': 'Product',
            '@id': `${canonicalUrl}#variant-${idx + 1}`,
            'name': `${product.name} - Màu ${colorObj.name || `Mẫu ${idx + 1}`}`,
            'sku': variantSku,
            'image': colorImg,
            'color': colorObj.name || '',
            'size': productSizes,
            'material': materialValue,
            ...(hasValidPrice ? {
              'offers': {
                '@type': 'Offer',
                'url': canonicalUrl,
                'priceCurrency': 'VND',
                'price': numericPrice,
                'availability': 'https://schema.org/InStock',
                'priceValidUntil': `${new Date().getFullYear()}-12-31`,
                'seller': {
                  '@type': 'Organization',
                  '@id': 'https://dongphucunivi.com/#organization',
                },
              },
            } : {}),
          };
        })
      : [];

    const meta = {
      title: `${product.name} - Đồng Phục Univi`,
      description: product.description || `Đồng phục ${categoryNameVN} từ Univi.`,
      author: 'Đồng Phục Univi',
      canonical: canonicalUrl,
      robots: 'index, follow',
      keywords: `${product.name},đồng phục Univi, ${categoryNameVN}`,
      og: {
        title: `${product.name} — Đồng Phục Univi`,
        description: product.description || "",
        type: 'product',
        image: productImage,
        imageWidth: '1200',
        imageHeight: '630',
        imageAlt: product.name,
        url: canonicalUrl,
        site_name: 'Đồng Phục Univi',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} — Đồng Phục Univi`,
        description: product.description || "",
        image: productImage,
      },
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          'itemListElement': breadcrumbListItems,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          '@id': `${canonicalUrl}#product`,
          'name': product.name,
          'image': finalImages,
          'description': product.description,
          'sku': product.maSanPham || `SP${product._id}`,
          'brand': { '@type': 'Brand', 'name': 'Đồng Phục Univi' },
          'material': materialValue,
          ...(colorNames.length > 0 ? { 'color': colorNames.length === 1 ? colorNames[0] : colorNames } : {}),
          'size': productSizes,
          ...(productVariants.length > 0 ? { 'hasVariant': productVariants } : {}),
          ...(hasValidPrice ? {
            'offers': {
              '@type': 'Offer',
              'url': canonicalUrl,
              'priceCurrency': 'VND',
              'price': numericPrice,
              ...(hasOriginalPrice
                ? { 'highPrice': numericOriginalPrice }
                : {}),
              'availability': 'https://schema.org/InStock',
              'priceValidUntil': `${new Date().getFullYear()}-12-31`,
              'seller': {
                '@type': 'Organization',
                '@id': 'https://dongphucunivi.com/#organization',
              },
            },
          } : {}),
        },
        ...(validFaqs.length > 0 ? [{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': validFaqs.map((faq) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer,
            },
          })),
        }] : []),
      ],
    };

    return { props: { product, meta, relatedProducts } };
  } catch (error) {
    console.error("Error in ProductDetailPage:", error);
    return { notFound: true };
  }
}
