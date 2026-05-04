'use client'

import { useState } from 'react'
import { GraduationCap, ExternalLink, Send, Bot } from 'lucide-react'
import { useChat } from '@ai-sdk/react'

const AREAS = [
  { valor: 'admin', etiqueta: '📊 Administración y Ventas' },
  { valor: 'operarios', etiqueta: '🔧 Operarios y Técnicos' },
  { valor: 'liderazgo', etiqueta: '👥 Supervisores y Jefaturas' },
  { valor: 'tecnologia', etiqueta: '💻 Tecnología e Informática' },
  { valor: 'gastronomia', etiqueta: '🍽️ Gastronomía y Comercio' },
  { valor: 'construccion', etiqueta: '🏗️ Construcción y Obra' },
]

export default function SencePage() {
  const [area, setArea] = useState('')
  const [necesidad, setNecesidad] = useState('')
  const { messages, sendMessage, status } = useChat()
  const isLoading = status === 'submitted' || status === 'streaming'

  const buscarOrientacion = async () => {
    if (!necesidad.trim()) return
    const prompt = `Área: ${area || 'General'}. Necesidad: "${necesidad}".
Recomiéndame 2 o 3 tipos de cursos SENCE concretos para esta necesidad. Solo nombre del curso y por qué sirve. Breve y directo. Incluye el link al catálogo al final.`
    sendMessage({ text: prompt })
  }

  return (
    <div className="p-6 max-w-4xl">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-rose-600" />
          </div>
          <h1 className="font-bold text-xl text-slate-900">Capacitación SENCE</h1>
        </div>
        <p className="text-sm text-slate-500">
          Orienta a tu equipo hacia cursos con Franquicia Tributaria. Las empresas pueden descontar hasta el{' '}
          <strong>1% de las remuneraciones imponibles anuales</strong> destinado a capacitación.
        </p>
      </div>

      {/* Info SENCE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
          <p className="text-2xl font-bold text-rose-600 mb-1">1%</p>
          <p className="text-xs text-rose-700">de las remuneraciones imponibles descontable de impuestos</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-sm font-semibold text-blue-700 mb-1">OTEC autorizados</p>
          <p className="text-xs text-blue-600">Solo cursos con Organismos Técnicos de Capacitación registrados en SENCE</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <a
            href="https://eligetucurso.sence.cl/?program=Cursos%20en%20l%c3%adnea"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-700 font-semibold text-sm mb-1 hover:underline"
          >
            Ver catálogo SENCE <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-xs text-emerald-600">
            Cursos en línea disponibles — catálogo oficial verificado
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Formulario */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">¿Qué necesita tu equipo?</h2>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-600 mb-2">Área de la empresa</label>
            <div className="grid grid-cols-2 gap-2">
              {AREAS.map(a => (
                <button
                  key={a.valor}
                  onClick={() => setArea(a.etiqueta)}
                  className={`text-left text-xs px-3 py-2.5 rounded-xl border transition-all
                    ${area === a.etiqueta
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-rose-300'}`}
                >
                  {a.etiqueta}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Describe la necesidad de capacitación
            </label>
            <textarea
              value={necesidad}
              onChange={e => setNecesidad(e.target.value)}
              placeholder="Ej: Mis vendedores necesitan mejorar en atención al cliente y uso de Excel para reportes de ventas..."
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400 resize-none"
            />
          </div>

          <button
            onClick={buscarOrientacion}
            disabled={isLoading || !(necesidad || '').trim()}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-medium py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            {isLoading ? 'Buscando orientación...' : 'Obtener orientación SENCE'}
          </button>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700">
              <strong>Ley 19.518:</strong>{' '}
              <a href="https://www.bcn.cl/leychile/navegar?idNorma=31892"
                target="_blank" rel="noopener noreferrer"
                className="underline">bcn.cl/leychile/navegar?idNorma=31892</a>
            </p>
          </div>
        </div>

        {/* Respuestas del agente */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Bot className="w-4 h-4 text-slate-400" />
            Orientación del asistente
          </h2>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-96">
            {messages.length === 0 ? (
              <div className="text-center py-10">
                <GraduationCap className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400">
                  Completa el formulario y recibe recomendaciones de cursos SENCE
                </p>
              </div>
            ) : (
              messages
                .filter(m => m.role === 'assistant')
                .map(m => (
                  <div key={m.id} className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {m.parts ? m.parts.map(p => p.type === 'text' ? p.text : '').join('') : (m as any).content}
                  </div>
                ))
            )}

            {isLoading && (
              <div className="bg-slate-50 rounded-xl p-4 flex gap-1">
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <a
              href="https://eligetucurso.sence.cl/?program=Cursos%20en%20l%c3%adnea"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ver catálogo de cursos SENCE en línea
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
