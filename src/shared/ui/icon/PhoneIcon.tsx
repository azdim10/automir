interface PhoneIconProps {
  className?: string
}

export function PhoneIcon({ className }: PhoneIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.6 3.5c.5-.9 1.6-1.2 2.5-.7l2.1 1.2c.8.5 1.1 1.5.7 2.3l-.8 1.6c.8 1.6 2.1 2.9 3.7 3.7l1.6-.8c.8-.4 1.8-.1 2.3.7l1.2 2.1c.5.9.2 2-.7 2.5l-2 .9c-1.2.5-2.6.2-4.1-.8-2.2-1.4-4.5-3.7-5.9-5.9-1-1.5-1.3-2.9-.8-4.1l.9-2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}
