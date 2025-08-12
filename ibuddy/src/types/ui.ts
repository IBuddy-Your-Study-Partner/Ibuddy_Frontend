import { ReactNode } from 'react'
import { ID } from './index'

// Button component types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
  isLoading?: boolean
  loadingText?: string
  disabled?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

// Modal component types
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  className?: string
}

// Form types
export interface FormFieldProps {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export interface InputProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  autoComplete?: string
  autoFocus?: boolean
  readOnly?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
}

export interface SelectProps extends FormFieldProps {
  options: SelectOption[]
  value?: string | number
  defaultValue?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  searchable?: boolean
  clearable?: boolean
  multiple?: boolean
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  group?: string
}

// Card component types
export interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
}

// Layout types
export interface LayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
}

// Navigation types
export interface NavItem {
  id: string
  label: string
  href?: string
  icon?: ReactNode
  badge?: string | number
  children?: NavItem[]
  disabled?: boolean
  external?: boolean
}

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

// Table types
export interface TableColumn<T = any> {
  key: string
  header: string
  accessor?: keyof T | ((row: T) => any)
  render?: (value: any, row: T) => ReactNode
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  className?: string
}

export interface TableProps<T = any> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  emptyMessage?: string
  sortable?: boolean
  selectable?: boolean
  onRowSelect?: (selectedRows: T[]) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  className?: string
}

// Progress types
export interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  label?: string
  animated?: boolean
  striped?: boolean
  className?: string
}

// Alert and notification types
export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  variant: AlertVariant
  title?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  icon?: ReactNode
  className?: string
}

// Loading states
export interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  text?: string
  overlay?: boolean
  className?: string
}

// Theme types
export interface ThemeColors {
  primary: string
  secondary: string
  success: string
  warning: string
  error: string
  info: string
  background: string
  surface: string
  text: {
    primary: string
    secondary: string
    disabled: string
  }
  border: string
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export interface ThemeBreakpoints {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

// Animation types
export type AnimationType = 
  | 'fade'
  | 'slide'
  | 'scale'
  | 'bounce'
  | 'flip'
  | 'rotate'
  | 'shake'

export interface AnimationProps {
  type: AnimationType
  duration?: number
  delay?: number
  repeat?: boolean | number
  direction?: 'normal' | 'reverse' | 'alternate'
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
}

// Responsive types
export type ResponsiveValue<T> = T | {
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}

// Accessibility types
export interface A11yProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-hidden'?: boolean
  'aria-selected'?: boolean
  'aria-disabled'?: boolean
  role?: string
  tabIndex?: number
}