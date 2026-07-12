interface CartIconProps {
  className?: string
}

export function CartIcon({ className }: CartIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3h2l1.2 6.2M7 13h11l2-7H6.2M7 13l-1.2-3.8M7 13l-1.5 6h13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="9" cy="20" fill="currentColor" r="1.2" stroke="none" />
      <circle cx="18" cy="20" fill="currentColor" r="1.2" stroke="none" />
    </svg>
  )
}
