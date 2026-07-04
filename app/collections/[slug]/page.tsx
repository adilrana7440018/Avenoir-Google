import db from '@/lib/db';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const title = resolvedParams.slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} Collection`,
    description: `Shop the curated ${title} collection at Avenoir.`,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const products = await db.product.findMany({
    where: { isFeatured: true },
  });

  const collectionTitle = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-bg-base py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
          <Link href="/" className="hover:text-accent-primary transition-colors">HOME</Link>
          <span>/</span>
          <span className="text-text-primary uppercase">COLLECTIONS</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold font-display text-text-primary uppercase tracking-tight">
            {collectionTitle} Collection
          </h1>
          <p className="text-xs text-text-secondary font-mono">
            CURATED LOADOUT &bull; {products.length} COMPONENTS
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
