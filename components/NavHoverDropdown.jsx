'use client'

import { ChevronDown } from 'lucide-react'

/**
 * Desktop nav item that reveals a dropdown on hover and keyboard focus-within.
 * Use a child panel with role="menu" for menu items.
 */
export default function NavHoverDropdown({ label, active = false, children }) {
  return (
    <div className="relative group">
      <button
        type="button"
        aria-haspopup="menu"
        className={`relative pb-1 inline-flex items-center gap-1 transition-colors hover:text-primary ${
          active ? 'text-primary' : ''
        }`}
      >
        {label}
        <ChevronDown
          className="h-4 w-4 opacity-70 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
          aria-hidden
        />
        {active ? (
          <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[3px] w-6 rounded-full bg-secondary" />
        ) : null}
      </button>

      {/* pt-2 bridges the gap so the pointer can reach the menu without closing */}
      <div
        className={[
          'pointer-events-none absolute left-1/2 top-full z-[60] w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-2',
          'invisible translate-y-0.5 opacity-0 transition-all duration-150',
          'group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
          'group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
