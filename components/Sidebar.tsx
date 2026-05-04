'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageSquare,
  Scale,
  Users,
  GraduationCap,
  Building2,
  ArrowLeft,
} from 'lucide-react'
import { clsx } from 'clsx'

const nav = [
  { href: '/dashboard',   label: 'Consulta Laboral',   icon: MessageSquare },
  { href: '/finiquito',   label: 'Finiquito',           icon: Scale },
  { href: '/curriculums', label: 'Filtro de CVs',       icon: Users },
  { href: '/sence',       label: 'SENCE',               icon: GraduationCap },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-none">HR Copilot</p>
            <p className="text-xs text-slate-400">PYMEs Chile 🇨🇱</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Inicio
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 leading-relaxed">
          Herramienta orientativa. No reemplaza asesoría legal.
        </p>
        <a
          href="https://www.dt.gob.cl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline mt-1 block"
        >
          Inspección del Trabajo →
        </a>
      </div>
    </aside>
  )
}
