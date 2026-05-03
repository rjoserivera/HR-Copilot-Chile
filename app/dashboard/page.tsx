'use client'

import { useChat } from '@ai-sdk/react'
import { Send, Bot, User, ExternalLink, RefreshCw } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

const preguntasRapidas = [
  '¿Cuándo un contrato a plazo fijo pasa a ser indefinido?',
  '¿Qué corresponde pagar al terminar un contrato por Art. 161?',
  '¿Cuántos días de vacaciones corresponden al año?',
  '¿Qué es el fuero sindical?',
  '¿Cómo funciona la Franquicia Tributaria SENCE?',
  '¿Qué dice la Ley 21.561 sobre las 40 horas?',
]

export default function DashboardPage() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, regenerate } = useChat()
  const isLoading = status === 'submitted' || status === 'streaming'
  const reload = () => regenerate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput('')
  }

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-screen">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-slate-900">Consulta Laboral</h1>
          <p className="text-sm text-slate-500">Pregunta sobre el Código del Trabajo chileno</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.dt.gob.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            dt.gob.cl <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Estado vacío */}
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="font-semibold text-slate-900 mb-2">¿En qué te ayudo hoy?</h2>
              <p className="text-sm text-slate-500">
                Consulta sobre contratos, finiquitos, derechos laborales, jornadas y más.
                Toda la información está basada en la legislación chilena vigente.
              </p>
            </div>

            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Preguntas frecuentes</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {preguntasRapidas.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p)}
                  className="text-left text-sm bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-4 py-3 rounded-xl transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lista de mensajes */}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-sm
              ${m.role === 'user' ? 'bg-slate-700' : 'bg-blue-600'}`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Burbuja */}
            <div
              className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap
                ${m.role === 'user'
                  ? 'bg-slate-800 text-white rounded-tr-sm'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                }`}
            >
              {m.parts ? m.parts.map(p => p.type === 'text' ? p.text : '').join('') : (m as any).content}
            </div>
          </div>
        ))}

        {/* Indicador de carga */}
        {isLoading && (
          <div className="flex gap-3 max-w-3xl">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex-shrink-0 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 p-4">
        {messages.length > 0 && (
          <button
            onClick={() => reload()}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-2 ml-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Nueva conversación
          </button>
        )}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ej: ¿Qué pasa si un trabajador a plazo fijo lleva más de 1 año?"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !(input || '').trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-2 ml-1">
          Basado en legislación chilena vigente. No reemplaza asesoría legal profesional.
        </p>
      </div>

    </div>
  )
}
