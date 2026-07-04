import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const title = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} | Avenoir Logs`,
    description: `Read Avenoir's engineering report on ${title}.`,
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const articles: Record<
    string,
    { title: string; category: string; readTime: string; content: string[] }
  > = {
    'fake-charger-warning-signs': {
      title: 'How to Spot a Fake Charger: A GaN Fast Engineering Guide',
      category: 'Guides',
      readTime: '4 min read',
      content: [
        'Gallium Nitride (GaN) fast chargers represent a massive leap forward in power density. By substituting silicon for GaN compounds, electrical engineers have successfully shrunk charging bricks by up to 50% while simultaneously reducing thermal dissipation. However, this has led to a flood of counterfeit and substandard charging units that skimp on vital components.',
        '1. Check the Weight: Premium GaN components require dense inductors, high-grade copper windings, and thermal heat sinks. If a 65W charger feels exceptionally light (less than 80 grams), it is likely using outdated silicon circuitry forced to run at dangerous frequencies.',
        '2. Inspect the Pin Quality: Real GaN chargers utilize milled brass pins, often nickel-plated, to reduce contact resistance. Cheap counterfeits use stamped sheet metal that easily bends and poses an arcing risk.',
        '3. Monitor the Heat Curve: True GaN systems run cool. If your fast charger exceeds 65°C under nominal phone charging loads, it lacks power-delivery negotiation chips and risks thermal runaway on your device battery.',
      ],
    },
    'aramid-vs-carbon-fiber': {
      title: 'Aramid Fiber vs Carbon Fiber: What Protections Actually Matter?',
      category: 'Engineering',
      readTime: '6 min read',
      content: [
        'Aramid fiber and carbon fiber are frequently conflated due to their similar woven aesthetic. However, their physical crystalline structures behave completely differently under stress.',
        'Carbon Fiber is exceptionally rigid and has an extremely high tensile strength along the fiber axis. This makes it perfect for structural aerospace frames, high-end automotive body panels, and rigid structures. However, this rigidity makes it brittle under localized sharp impacts; it does not disperse impact energy, it cracks or passes the shock straight through.',
        'Aramid Fiber (synthetic polyamide threads, commonly known as Kevlar) has high impact tolerance, high puncture resistance, and does not conduct electricity. Under impact, the aramid weave flexes slightly, dissipating the kinetic force outward along its threads rather than letting it penetrate. This is why Avenoir mills armor cases from bulletproof aramid rather than pure carbon fiber.',
      ],
    },
    'drop-protection-physics': {
      title: 'Is 10m Drop Protection Overkill? The Physics of Accelerometer G-Force',
      category: 'Science',
      readTime: '5 min read',
      content: [
        'A standard drop test (Mil-Spec 810G) specifies a 1.2m drop onto plywood. In the real world, digital tools fall from cars, balconies, and ladders. The kinetic force at terminal impact increases exponentially with height.',
        'When a phone hits concrete, the deceleration must occur within a fraction of a millimeter. Without energy dispersion, this creates shockwaves exceeding 300 Gs of impact acceleration, easily fracturing motherboards and internal camera sensors.',
        'Avenoir Monolith cases utilize an internal layer of proprietary self-healing polymers and corner aramid buffers to stretch the deceleration event by microseconds, reducing peak G-forces by up to 90%, allowing your hardware to survive impact events up to 10m.',
      ],
    },
  };

  const article = articles[slug] || {
    title: 'Log Entry Compiled Successfully',
    category: 'Engineering',
    readTime: '3 min read',
    content: [
      'This log entry represents a placeholder data node inside the Avenoir manifest. The content compiles successfully but contains mock parameters.',
    ],
  };

  return (
    <div className="min-h-screen bg-bg-base py-10 md:py-16">
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
          <Link href="/" className="hover:text-accent-primary transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-accent-primary transition-colors">GUIDES</Link>
          <span>/</span>
          <span className="text-text-primary truncate max-w-[200px]">{article.title}</span>
        </div>

        {/* Main Article Container */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Header Details */}
          <div className="space-y-4 pb-6 border-b border-border-subtle">
            <span className="text-[9px] uppercase font-bold text-accent-primary font-mono tracking-widest bg-accent-primary-soft px-2.5 py-1 rounded border border-accent-primary/10 w-fit block">
              {article.category} Division
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-text-primary">
              {article.title}
            </h1>
            <p className="text-xs text-text-secondary font-mono">{article.readTime} &bull; Published by Avenoir Labs</p>
          </div>

          {/* Content paragraphs */}
          <article className="space-y-6 text-sm text-text-secondary leading-relaxed">
            {article.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </article>
        </div>

        {/* Return Button */}
        <div className="pt-8 border-t border-border-subtle">
          <Link
            href="/guides"
            className="text-xs font-bold text-accent-primary hover:underline flex items-center gap-1.5"
          >
            &larr; Return to Engineering Logs
          </Link>
        </div>
      </div>
    </div>
  );
}
