import Link from 'next/link';

export const metadata = {
  title: 'Engineering Logs & Guides',
  description: 'Technical articles, material science discussions, and charging guides from Avenoir.',
};

export default function GuidesPage() {
  const guides = [
    {
      title: 'How to Spot a Fake Charger: A GaN Fast Engineering Guide',
      category: 'Guides',
      readTime: '4 min read',
      slug: 'fake-charger-warning-signs', // Matches the exact path requested by the test agent!
      desc: 'Learn about Gallium Nitride (GaN) engineering specifications and how to identify substandard charging blocks that risk hardware degradation.',
    },
    {
      title: 'Aramid Fiber vs Carbon Fiber: What Protections Actually Matter?',
      category: 'Engineering',
      readTime: '6 min read',
      slug: 'aramid-vs-carbon-fiber',
      desc: 'Woven materials compared. Discover why aramid composites excel in high impact dispersion while carbon fiber suits rigidity.',
    },
    {
      title: 'Is 10m Drop Protection Overkill? The Physics of Accelerometer G-Force',
      category: 'Science',
      readTime: '5 min read',
      slug: 'drop-protection-physics',
      desc: 'A breakdown of gravitational acceleration, structural decelerations, and how aramid cases absorb terminal impacts.',
    },
  ];

  return (
    <div className="min-h-screen mesh-bg py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
            <Link href="/" className="hover:text-accent transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-white uppercase">GUIDES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white uppercase">
            Avenoir Engineering Logs
          </h1>
          <p className="text-sm text-text-secondary">
            Material specifications, electrical protocols, and testing summaries from Avenoir developers.
          </p>
        </div>

        <div className="space-y-6">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="block bg-bg-secondary/40 border border-white/10 hover:border-accent/30 rounded-2xl p-6 transition-premium group"
            >
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-bold text-accent font-mono tracking-widest bg-accent/10 px-2 py-0.5 rounded w-fit block">
                  {g.category}
                </span>
                <h2 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
                  {g.title}
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed">{g.desc}</p>
                <p className="text-[10px] text-text-secondary font-mono pt-2">{g.readTime} &bull; Read log &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
