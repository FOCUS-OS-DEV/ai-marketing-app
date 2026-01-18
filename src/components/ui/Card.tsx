interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function Card({ children, className = '', title, description, actions }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}
