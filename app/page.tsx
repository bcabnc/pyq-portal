import { getCatalog } from '@/lib/pyq-service';
import PYQExplorer from '@/components/PYQExplorer';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const catalog = getCatalog();

  return <PYQExplorer initialCatalog={catalog} />;
}
