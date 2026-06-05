'use client'

interface ProjectFilterProps {
  tags: string[]
  active: string
  onChange: (tag: string) => void
}

export default function ProjectFilter({ tags, active, onChange }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-12">
      {['All', ...tags].map(tag => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className={[
            'font-body text-[10px] uppercase tracking-[0.15em] px-4 py-2 border transition-all duration-200',
            active === tag
              ? 'bg-gold text-base border-gold'
              : 'border-gold text-gold hover:bg-gold/10',
          ].join(' ')}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
