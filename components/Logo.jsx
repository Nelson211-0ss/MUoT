export default function Logo({ className = 'h-14 w-14' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M32 4L52 12V32C52 44 42 54 32 58C22 54 12 44 12 32V12L32 4Z"
        fill="#071C4D"
        stroke="#F5B700"
        strokeWidth="1.5"
      />
      <path
        d="M32 8C24 12 16 18 16 26V32C16 40 22 46 32 50C42 46 48 40 48 32V26C48 18 40 12 32 8Z"
        fill="#0E2A6B"
      />
      <rect x="22" y="22" width="20" height="14" rx="2" fill="#F5B700" />
      <rect x="24" y="24" width="16" height="10" rx="1" fill="#071C4D" />
      <path d="M28 38H36" stroke="#F5B700" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="32" cy="52" rx="18" ry="6" stroke="#F5B700" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path
        d="M14 20C18 14 24 10 32 10C40 10 46 14 50 20"
        stroke="#F5B700"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M14 44C18 50 24 54 32 54C40 54 46 50 50 44"
        stroke="#F5B700"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}
