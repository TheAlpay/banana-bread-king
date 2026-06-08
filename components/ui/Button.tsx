import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    primary: 'bg-[#8B4513] text-[#fdf8f0] hover:bg-[#7a3b10] focus:ring-[#8B4513]',
    secondary: 'bg-[#f5e6d3] text-[#8B4513] hover:bg-[#f0d9c0] focus:ring-[#8B4513]',
    ghost: 'bg-transparent text-[#8B4513] hover:bg-[#f5e6d3] focus:ring-[#8B4513]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}
