'use client'

import { useRef, useEffect } from 'react'

interface EditableContentProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function EditableContent({ value, onChange, placeholder = 'לחץ לעריכה...', className = '' }: EditableContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value
    }
  }, [value])

  const handleBlur = () => {
    if (ref.current) {
      onChange(ref.current.innerHTML)
    }
  }

  return (
    <div
      ref={ref}
      contentEditable
      onBlur={handleBlur}
      className={`min-h-[100px] p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${className}`}
      data-placeholder={placeholder}
      suppressContentEditableWarning
    />
  )
}
