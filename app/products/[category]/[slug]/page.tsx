import db from '@/lib/db';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await db.product.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Fetch product from database
  const product = await db.product.findUnique({
    where: { slug: slug },
    include: {
      variants: true,
      reviews: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!product) {
    return (
      <div className="min-h-screen mesh-bg flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-3xl font-extrabold font-display text-white uppercase tracking-wider">
          Accessory Not Compiled
        </h1>
        <p className="text-sm text-text-secondary max-w-sm mt-3 leading-relaxed">
          The accessory slug requested does not map to any physical carbon composite or fast GaN components in our current manifest.
        </p>
        <Link
          href="/products/cases"
          className="mt-8 px-6 py-3 bg-accent hover:bg-cyan-400 text-bg-primary font-bold rounded-xl text-sm transition-premium"
        >
          Return to Armory Catalog
        </Link>
      </div>
    );
  }

  // Fetch related products (same category, different id)
  const relatedProducts = await db.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
  });

  // Cast product to expected type for compatibility
  const plainProduct = {
    ...product,
    reviews: product.reviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  };

  return (
    <ProductDetailClient
      product={plainProduct as any}
      relatedProducts={relatedProducts}
    />
  );
}
