'use client'

import React from 'react'

interface CustomSelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: string[] | { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  className?: string
}

export function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  className = '',
}: CustomSelectProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[12px] font-bold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="form-input rounded-xl border-gray-100 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value
          const lbl = typeof opt === 'string' ? opt : opt.label
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          )
        })}
      </select>
    </div>
  )
}
