import { Lock, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

const badges = [
  {
    icon: Lock,
    title: 'Secure Checkout',
    desc: 'PCI-compliant card processing.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Dispatched from regional hubs.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    desc: 'Easy, self-service return labels.',
  },
  {
    icon: ShieldCheck,
    title: 'Lifetime Warranty',
    desc: 'Structural protection coverage.',
  },
];

export default function TrustSection() {
  return (
    <section className="bg-bg-elevated/40 border-y border-border-subtle py-10 my-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 bg-bg-surface border border-border-subtle rounded-xl flex items-center justify-center text-accent-primary">
                <Icon size={18} />
              </div>
              <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                {badge.title}
              </h4>
              <p className="text-[11px] text-text-secondary leading-relaxed max-w-[160px] mx-auto">
                {badge.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
