import { useState } from 'react'

interface HeaderLogoProps {
  alt: string
  className: string
  fallbackClassName: string
  url: string
}

export function HeaderLogo({
  alt,
  className,
  fallbackClassName,
  url,
}: HeaderLogoProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <span className={fallbackClassName} />
  }

  return (
    <img
      alt={alt}
      className={className}
      src={url}
      onError={() => {
        setHasError(true)
      }}
    />
  )
}
