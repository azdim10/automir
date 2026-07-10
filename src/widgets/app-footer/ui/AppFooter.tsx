import type { ReactNode } from 'react'

interface FooterLink {
  href: string
  label: string
}

interface AppFooterProps {
  content?: ReactNode
  links: FooterLink[]
}

export function AppFooter({ content, links }: AppFooterProps) {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6">
        {content}
        <nav>
          <ul className="flex flex-wrap gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
