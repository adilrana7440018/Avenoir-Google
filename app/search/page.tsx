import db from '@/lib/db';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || '';
  return {
    title: `Search: "${q}"`,
    description: `Search results for "${q}" on Avenoir premium tech accessories.`,
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';

  let products: any[] = [];
  if (query.trim() !== '') {
    products = await db.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { contains: query } },
          { compatibility: { contains: query } },
        ],
      },
    });
  }

  return (
    <div className="min-h-screen bg-bg-base py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
          <Link href="/" className="hover:text-accent-primary transition-colors">HOME</Link>
          <span>/</span>
          <span className="text-text-primary uppercase">Search Results</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold font-display text-text-primary uppercase tracking-tight">
            Search Manifest
          </h1>
          <p className="text-xs text-text-secondary font-mono">
            QUERY: &ldquo;<span className="text-accent-primary font-semibold">{query}</span>&rdquo; &bull; RESULTS: {products.length}
          </p>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="border border-dashed border-border-subtle bg-bg-surface rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-text-primary font-medium text-lg">No matches compiled</p>
            <p className="text-sm text-text-secondary max-w-sm">
              We couldn&apos;t locate any carbon cases or fast power accessories matching your specs. Try searching for &ldquo;carbon&rdquo;, &ldquo;case&rdquo;, or &ldquo;cyan&rdquo;.
            </p>
            <Link
              href="/products/cases"
              className="px-5 py-2.5 bg-accent-primary hover:bg-accent-primary/90 text-white font-bold rounded-xl text-xs transition-premium mt-2"
            >
              Browse Full Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
