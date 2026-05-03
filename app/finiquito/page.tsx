'use client'

import { useState } from 'react'
import { Scale, Calculator, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react'

const CAUSALES = [
  { valor: '159-1', etiqueta: 'Art. 159 N°1 — Mutuo acuerdo' },
  { valor: '159-2', etiqueta: 'Art. 159 N°2 — Renuncia voluntaria' },
  { valor: '159-4', etiqueta: 'Art. 159 N°4 — Vencimiento de plazo' },
  { valor: '159-5', etiqueta: 'Art. 159 N°5 — Conclusión de obra/faena' },
  { valor: '159-6', etiqueta: 'Art. 159 N°6 — Caso fortuito/fuerza mayor' },
  { valor: '160-1', etiqueta: 'Art. 160 N°1 — Falta de probidad' },
  { valor: '160-2', etiqueta: 'Art. 160 N°2 — Acoso sexual o laboral' },
  { valor: '160-7', etiqueta: 'Art. 160 N°7 — Inasistencia injustificada' },
  { valor: '160-11', etiqueta: 'Art. 160 N°11 — Incumplimiento grave' },
  { valor: '161', etiqueta: 'Art. 161 — Necesidades de la empresa' },
]

interface Resultado {
  vacacionesProporcionales: { dias: number; monto: number; calculo: string }
  gratificacionProporcional: { meses: number; monto: number; calculo: string }
  indemnizacionAnosServicio: { anos: number; monto: number; calculo: string; aplica: boolean }
  indemnizacionAvisoPrevio: { monto: number; calculo: string; aplica: boolean }
  totalFiniquito: number
  resumen: string[]
  advertencias: string[]
}

export default function FiniquitoPage() {
  const [form, setForm] = useState({
    sueldoBruto: '',
    fechaInicio: '',
    fechaTermino: '',
    causal: '159-2',
    avisoPrevio: false,
    gratificacionMensual: false,
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    setResultado(null)

    try {
      const res = await fetch('/api/finiquito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sueldoBruto: Number(form.sueldoBruto.replace(/\D/g, '')),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResultado(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al calcular')
    } finally {
      setCargando(false)
    }
  }

  const formatCLP = (n: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n)

  return (
    <div className="p-6 max-w-4xl">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Scale className="w-5 h-5 text-emerald-600" />
          </div>
          <h1 className="font-bold text-xl text-slate-900">Calculadora de Finiquito</h1>
        </div>
        <p className="text-sm text-slate-500">
          Calcula el finiquito según el Código del Trabajo Chile.{' '}
          <a href="https://www.dt.gob.cl/legislacion/1624/w3-article-95516.html"
            target="_blank" rel="noopener noreferrer"
            className="text-blue-500 hover:underline inline-flex items-center gap-1">
            Ver Art. 162-163 CT <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Formulario */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-slate-400" />
            Datos del trabajador
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Sueldo bruto mensual (CLP)
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 700000"
                value={form.sueldoBruto}
                onChange={e => setForm(p => ({ ...p, sueldoBruto: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Fecha de inicio del contrato
              </label>
              <input
                type="date"
                required
                value={form.fechaInicio}
                onChange={e => setForm(p => ({ ...p, fechaInicio: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Fecha de término
              </label>
              <input
                type="date"
                required
                value={form.fechaTermino}
                onChange={e => setForm(p => ({ ...p, fechaTermino: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Causal de despido
              </label>
              <select
                value={form.causal}
                onChange={e => setForm(p => ({ ...p, causal: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
              >
                {CAUSALES.map(c => (
                  <option key={c.valor} value={c.valor}>{c.etiqueta}</option>
                ))}
              </select>
            </div>

            {form.causal === '161' && (
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                <input
                  type="checkbox"
                  id="avisoPrevio"
                  checked={form.avisoPrevio}
                  onChange={e => setForm(p => ({ ...p, avisoPrevio: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-600"
                />
                <label htmlFor="avisoPrevio" className="text-sm text-slate-700">
                  Se dio aviso previo de 30 días
                </label>
              </div>
            )}

            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
              <input
                type="checkbox"
                id="gratMensual"
                checked={form.gratificacionMensual}
                onChange={e => setForm(p => ({ ...p, gratificacionMensual: e.target.checked }))}
                className="w-4 h-4 accent-emerald-600"
              />
              <label htmlFor="gratMensual" className="text-sm text-slate-700">
                Gratificación ya pagada mensualmente
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              {cargando ? 'Calculando...' : 'Calcular Finiquito'}
            </button>
          </form>
        </div>

        {/* Resultado */}
        <div className="space-y-4">
          {!resultado ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <Scale className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">El resultado aparecerá aquí</p>
            </div>
          ) : (
            <>
              {/* Total destacado */}
              <div className="bg-emerald-600 rounded-2xl p-5 text-white">
                <p className="text-emerald-100 text-sm mb-1">Total Finiquito</p>
                <p className="text-3xl font-bold">{formatCLP(resultado.totalFiniquito)}</p>
                <p className="text-xs text-emerald-200 mt-2">
                  Plazo de pago: 10 días hábiles desde el término (Art. 162 CT)
                </p>
              </div>

              {/* Desglose */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <h3 className="font-semibold text-slate-800 text-sm mb-3">Desglose</h3>

                <DesgloseFila
                  label="Vacaciones proporcionales"
                  monto={resultado.vacacionesProporcionales.monto}
                  detalle={resultado.vacacionesProporcionales.calculo}
                  aplica
                />
                <DesgloseFila
                  label="Gratificación proporcional"
                  monto={resultado.gratificacionProporcional.monto}
                  detalle={resultado.gratificacionProporcional.calculo}
                  aplica
                />
                <DesgloseFila
                  label={`Indemnización años de servicio (${resultado.indemnizacionAnosServicio.anos} año/s)`}
                  monto={resultado.indemnizacionAnosServicio.monto}
                  detalle={resultado.indemnizacionAnosServicio.calculo}
                  aplica={resultado.indemnizacionAnosServicio.aplica}
                />
                <DesgloseFila
                  label="Aviso previo (sustitutivo)"
                  monto={resultado.indemnizacionAvisoPrevio.monto}
                  detalle={resultado.indemnizacionAvisoPrevio.calculo}
                  aplica={resultado.indemnizacionAvisoPrevio.aplica}
                />
              </div>

              {/* Advertencias */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 font-medium text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Advertencias
                </div>
                {resultado.advertencias.map((a, i) => (
                  <p key={i} className="text-xs text-amber-700 leading-relaxed">{a}</p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function DesgloseFila({
  label, monto, detalle, aplica,
}: {
  label: string
  monto: number
  detalle: string
  aplica: boolean
}) {
  const formatCLP = (n: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n)

  return (
    <div className={`rounded-xl p-3 ${aplica ? 'bg-slate-50' : 'bg-slate-50 opacity-40'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${aplica ? 'text-emerald-500' : 'text-slate-300'}`} />
          <span className="text-xs font-medium text-slate-700">{label}</span>
        </div>
        <span className={`text-sm font-semibold flex-shrink-0 ${aplica ? 'text-slate-900' : 'text-slate-400'}`}>
          {aplica ? formatCLP(monto) : 'No aplica'}
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-1 ml-5">{detalle}</p>
    </div>
  )
}
