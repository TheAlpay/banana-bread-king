interface BadgeProps {
  label: string
  variant?: 'default' | 'green' | 'brown' | 'yellow'
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-[#f5e6d3] text-[#8B4513]',
    green: 'bg-green-100 text-green-800',
    brown: 'bg-[#8B4513] text-[#fdf8f0]',
    yellow: 'bg-yellow-100 text-yellow-800',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {label}
    </span>
  )
}
