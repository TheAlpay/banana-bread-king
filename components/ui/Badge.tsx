interface BadgeProps {
  label: string
  variant?: 'default' | 'green' | 'brown' | 'yellow'
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-[#F2E4CE] text-[#7A4520]',
    green:   'bg-[#E4F2EA] text-[#1A5C3A]',
    brown:   'bg-[#5C2B0F] text-[#FAF6EF]',
    yellow:  'bg-amber-100 text-amber-800',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${variants[variant]}`}
    >
      {label}
    </span>
  )
}
