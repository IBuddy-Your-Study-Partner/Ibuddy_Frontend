import { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
    children: ReactNode
    className?: string
    padding?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'elevated' | 'bordered'
}

export default function Card({
    children,
    className,
    padding = 'md',
    variant = 'default'
}: CardProps): JSX.Element {
    const baseStyles = 'bg-white rounded-xl'
    
    const variants = {
        default: 'shadow-sm border border-gray-100',
        elevated: 'shadow-lg',
        bordered: 'border-2 border-gray-200'
    }
    
    const paddings = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    }

    return (
        <div className={cn(baseStyles, variants[variant], paddings[padding], className)}>
        {children}
        </div>
    )
}