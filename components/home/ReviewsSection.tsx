import { Star, CheckCircle } from 'lucide-react';

const reviews = [
  {
    name: 'James W.',
    rating: 5,
    text: "Best case I have ever owned. Incredibly light yet feels indestructible. The aramid fiber texture is premium and has a great tactile grip.",
  },
  {
    name: 'Sarah M.',
    rating: 5,
    text: "The GaN charger is a game-changer. So compact and charges my devices faster than anything else while running incredibly cool.",
  },
  {
    name: 'Alex R.',
    rating: 4,
    text: "Beautiful cable quality. The braided design looks great and feels very durable. Perfect match for my desk setup.",
  },
];

export default function ReviewsSection() {
  return (
    <section className="max-w-7xl mx-auto w-full px-6 py-12 md:py-16 space-y-8 border-t border-border-subtle">
      <h3 className="font-serif-display text-2xl sm:text-3xl text-text-primary text-center">
        What Our Customers Say
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-bg-surface border border-border-subtle rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < rev.rating
                        ? 'text-accent-secondary fill-accent-secondary'
                        : 'text-border-subtle'
                    }
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-xs text-text-secondary italic mt-4 leading-relaxed">
                &ldquo;{rev.text}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="mt-6 flex items-center justify-between border-t border-border-subtle/50 pt-4">
              <span className="text-xs font-semibold text-text-primary">
                {rev.name}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-green-700 font-medium">
                <CheckCircle size={12} />
                <span>Verified Purchase</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
