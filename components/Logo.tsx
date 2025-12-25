import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: number
}

const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 40 }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src="/logo.svg"
          alt="MonFair Logo"
          width={size}
          height={size}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className="text-2xl font-brand font-extrabold bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-300 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
          MonFair
        </span>
      )}
    </div>
  )
}

export default Logo

