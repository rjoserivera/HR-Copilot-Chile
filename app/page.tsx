'use client'

import Link from 'next/link'
import {
  MessageSquare,
  FileText,
  Users,
  Bell,
  GraduationCap,
  Scale,
  ExternalLink,
  ChevronRight,
  Building2,
} from 'lucide-react'

const modulos = [
  {
    href: '/dashboard',
    icon: MessageSquare,
    titulo: 'Consulta Laboral',
    descripcion: 'Pregúntale al asistente sobre leyes, contratos y derechos laborales chilenos.',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    badge: null,
  },
  {
    href: '/finiquito',
    icon: Scale,
    titulo: 'Calculadora de Finiquito',
    descripcion: 'Calcula vacaciones, indemnización y gratificación según el Código del Trabajo.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    badge: null,
  },
  {
    href: '/curriculums',
    icon: Users,
    titulo: 'Filtro de CVs',
    descripcion: 'Sube currículums y el agente rankea candidatos según el perfil del cargo.',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    badge: 'IA',
  },
  {
    href: '/alertas',
    icon: Bell,
    titulo: 'Alertas de Contratos',
    descripcion: 'Registra trabajadores y recibe alertas de vencimientos, renovaciones y derechos.',
    color: 'bg-orange-50 text-orange-600 border-orange-100',
    badge: null,
  },
  {
    href: '/sence',
    icon: GraduationCap,
    titulo: 'Capacitación SENCE',
    descripcion: 'Orienta a tu equipo hacia cursos con Franquicia Tributaria SENCE.',
    color: 'bg-rose-50 text-rose-600 border-rose-100',
    badge: null,
  },
]

const fuentesLegales = [
  { nombre: 'Código del Trabajo', url: 'https://www.dt.gob.cl/legislacion/1624/w3-article-95516.html' },
  { nombre: 'Ley 19.728 AFC', url: 'https://www.bcn.cl/leychile/navegar?idNorma=184979' },
  { nombre: 'Ley 21.561 (40h)', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1191554' },
  { nombre: 'Ley 21.643 Acoso', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1200096' },
  { nombre: 'Ley 16.744 Accidentes', url: 'https://www.bcn.cl/leychile/navegar?idNorma=28650' },
  { nombre: 'SENCE Cursos Online', url: 'https://eligetucurso.sence.cl/?program=Cursos%20en%20l%c3%adnea' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none">HR Copilot</h1>
              <p className="text-xs text-slate-500">Gestión Laboral para PYMEs Chile</p>
            </div>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 font-medium">
            v1.0
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full mb-4 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Asistente activo — Basado en legislación chilena vigente
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Tu asistente de RRHH para PYMEs 🇨🇱
          </h2>
          <p className="text-slate-500 max-w-xl">
            Calcula finiquitos, filtra candidatos con IA, recibe alertas de contratos y consulta la ley laboral — todo en un solo lugar, gratis y en español chileno.
          </p>
        </div>

        {/* Aviso legal */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3">
          <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
          <p className="text-sm text-amber-800">
            <strong>Aviso legal:</strong> Esta herramienta es orientativa y no reemplaza a un abogado laboral ni a la Inspección del Trabajo.
            Los cálculos son referenciales. Para casos complejos, consulta en{' '}
            <a href="https://www.dt.gob.cl" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              dt.gob.cl
            </a>.
          </p>
        </div>

        {/* Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {modulos.map((mod) => {
            const Icon = mod.icon
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${mod.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    {mod.badge && (
                      <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
                        {mod.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{mod.titulo}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{mod.descripcion}</p>
              </Link>
            )
          })}
        </div>

        {/* Fuentes verificadas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold text-slate-700 text-sm">Fuentes Legales Verificadas</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Toda la información de esta app está basada en los siguientes documentos oficiales, verificados manualmente.
            Los PDFs están disponibles en <code className="bg-slate-100 px-1 rounded">/context/leyes/</code> del proyecto.
          </p>
          <div className="flex flex-wrap gap-2">
            {fuentesLegales.map((f) => (
              <a
                key={f.url}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                {f.nombre}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
