'use client';

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {['All', ...categories].map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className="px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 hover:scale-105"
            style={{
              borderColor: isActive ? 'var(--accent)' : 'var(--border)',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--accent-glow)' : 'transparent',
            }}
            data-cursor="pointer"
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
