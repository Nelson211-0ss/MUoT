import { Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react'

/** Update hrefs when official MUT profiles are published. */
const SOCIAL_ITEMS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/',
    Icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    Icon: Instagram,
  },
  {
    label: 'X (Twitter)',
    href: 'https://twitter.com/',
    Icon: Twitter,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    Icon: Linkedin,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/',
    Icon: Youtube,
  },
]

export default function SocialLinks({ variant = 'light', className = '' }) {
  const linkClasses =
    variant === 'dark'
      ? 'text-gray-400 hover:text-secondary hover:bg-white/10'
      : 'text-primary/60 hover:text-primary hover:bg-gray-50'

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Social media">
      {SOCIAL_ITEMS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} — opens in new tab`}
            className={`inline-flex rounded-lg p-2 transition-colors ${linkClasses}`}
          >
            <Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}
