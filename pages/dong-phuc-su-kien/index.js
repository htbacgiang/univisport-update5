import EnterpriseFlatCategoryPage from '../../components/univisport/EnterpriseFlatCategoryPage';
import { createEnterpriseFlatGetServerSideProps } from '../../lib/enterpriseFlatPageProps';
import { ENTERPRISE_FLAT_SLUGS } from '../../lib/enterpriseFlatSlugs';

const PRODUCT_LINE = 'su-kien';
const FLAT_SLUG = ENTERPRISE_FLAT_SLUGS[PRODUCT_LINE];

export default function DongPhucSuKien(props) {
  return <EnterpriseFlatCategoryPage {...props} />;
}

export const getServerSideProps = createEnterpriseFlatGetServerSideProps(PRODUCT_LINE, FLAT_SLUG);
