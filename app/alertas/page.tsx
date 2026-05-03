'use client'

import { useState } from 'react'
import { Bell, Plus, Trash2, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react'

interface Trabajador {
  id: string
  nombre: string
  cargo: string
  tipoContrato: 'indefinido' | 'plazo_fijo' | 'obra_faena'
  fechaInicio: string
  fechaTermino?: string
  renovaciones: number
  sueldo: number
}

function calcularAlertas(t: Trabajador) {
  const alertas: { tipo: 'roja' | 'amarilla' | 'verde'; mensaje: string }[] = []
  const hoy = new Date()
  const inicio = new Date(t.fechaInicio)
  const mesesTrabajados = (hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  const anosTrabjados = mesesTrabajados / 12

  if (t.tipoContrato === 'plazo_fijo') {
    if (t.renovaciones >= 2) {
      alertas.push({ tipo: 'roja', mensaje: `⚠️ ${t.renovaciones} renovaciones detectadas → contrato ya es INDEFINIDO por ley (Art. 159 N°4 CT)` })
    } else if (t.renovaciones === 1) {
      alertas.push({ tipo: 'amarilla', mensaje: 'Esta sería la segunda renovación → el siguiente contrato DEBE ser indefinido' })
    }

    if (t.fechaTermino) {
      const termino = new Date(t.fechaTermino)
      const diasRestantes = Math.ceil((termino.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

      if (diasRestantes < 0) {
        alertas.push({ tipo: 'roja', mensaje: `Contrato venció hace ${Math.abs(diasRestantes)} días. Si el trabajador sigue, ya es INDEFINIDO.` })
      } else if (diasRestantes <= 7) {
        alertas.push({ tipo: 'roja', mensaje: `Contrato vence en ${diasRestantes} día(s). Definir renovación o término urgente.` })
      } else if (diasRestantes <= 30) {
        alertas.push({ tipo: 'amarilla', mensaje: `Contrato vence en ${diasRestantes} días. Planificar acción.` })
      }
    }
  }

  if (mesesTrabajados >= 11.5 && mesesTrabajados < 13) {
    alertas.push({ tipo: 'amarilla', mensaje: `Trabajador cumple 1 año pronto → derecho a 15 días hábiles de vacaciones anuales.` })
  }

  if (anosTrabjados >= 1 && mesesTrabajados % 12 < 1) {
    alertas.push({ tipo: 'verde', mensaje: `Cumplió ${Math.floor(anosTrabjados)} año(s) → verificar pago de gratificación y vacaciones.` })
  }

  if (alertas.length === 0) {
    alertas.push({ tipo: 'verde', mensaje: 'Contrato en regla. Sin alertas pendientes.' })
  }

  return alertas
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function tiempoTrabajado(fechaInicio: string) {
  const inicio = new Date(fechaInicio)
  const hoy = new Date()
  const dias = Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
  const meses = Math.floor(dias / 30.44)
  const anos = Math.floor(meses / 12)
  const mesesResto = meses % 12
  if (anos > 0) return `${anos} año${anos > 1 ? 's' : ''} y ${mesesResto} mes${mesesResto !== 1 ? 'es' : ''}`
  return `${meses} mes${meses !== 1 ? 'es' : ''}`
}

export default function AlertasPage() {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([
    {
      id: '1',
      nombre: 'María González',
      cargo: 'Vendedora',
      tipoContrato: 'plazo_fijo',
      fechaInicio: '2024-06-01',
      fechaTermino: '2025-05-31',
      renovaciones: 1,
      sueldo: 650000,
    },
    {
      id: '2',
      nombre: 'Juan Pérez',
      cargo: 'Técnico',
      tipoContrato: 'indefinido',
      fechaInicio: '2023-04-15',
      renovaciones: 0,
      sueldo: 850000,
    },
  ])

  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    cargo: '',
    tipoContrato: 'indefinido' as Trabajador['tipoContrato'],
    fechaInicio: '',
    fechaTermino: '',
    renovaciones: 0,
    sueldo: '',
  })

  const agregar = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo: Trabajador = {
      id: Date.now().toString(),
      nombre: form.nombre,
      cargo: form.cargo,
      tipoContrato: form.tipoContrato,
      fechaInicio: form.fechaInicio,
      fechaTermino: form.fechaTermino || undefined,
      renovaciones: Number(form.renovaciones),
      sueldo: Number(form.sueldo),
    }
    setTrabajadores(prev => [...prev, nuevo])
    setMostrarForm(false)
    setForm({ nombre: '', cargo: '', tipoContrato: 'indefinido', fechaInicio: '', fechaTermino: '', renovaciones: 0, sueldo: '' })
  }

  const eliminar = (id: string) => setTrabajadores(prev => prev.filter(t => t.id !== id))

  const colorAlerta = { roja: 'bg-red-50 border-red-200 text-red-700', amarilla: 'bg-amber-50 border-amber-200 text-amber-700', verde: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
  const iconoAlerta = { roja: <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />, amarilla: <Clock className="w-3.5 h-3.5 flex-shrink-0" />, verde: <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> }

  const totalRojas = trabajadores.flatMap(t => calcularAlertas(t)).filter(a => a.tipo === 'roja').length

  return (
    <div className="p-6 max-w-4xl">

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <h1 className="font-bold text-xl text-slate-900">Alertas de Contratos</h1>
            {totalRojas > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalRojas} urgente{totalRojas > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Registra trabajadores y recibe alertas automáticas de vencimientos y derechos.{' '}
            <a href="https://www.dt.gob.cl/legislacion/1624/w3-article-95516.html"
              target="_blank" rel="noopener noreferrer"
              className="text-blue-500 hover:underline inline-flex items-center gap-1">
              Art. 159 CT <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">Nuevo trabajador</h2>
          <form onSubmit={agregar} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Nombre completo</label>
              <input required value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Cargo</label>
              <input required value={form.cargo} onChange={e => setForm(p => ({ ...p, cargo: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de contrato</label>
              <select value={form.tipoContrato} onChange={e => setForm(p => ({ ...p, tipoContrato: e.target.value as Trabajador['tipoContrato'] }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-white">
                <option value="indefinido">Indefinido</option>
                <option value="plazo_fijo">Plazo fijo</option>
                <option value="obra_faena">Por obra/faena</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Sueldo bruto (CLP)</label>
              <input type="number" required value={form.sueldo} onChange={e => setForm(p => ({ ...p, sueldo: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Fecha inicio</label>
              <input type="date" required value={form.fechaInicio} onChange={e => setForm(p => ({ ...p, fechaInicio: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            {form.tipoContrato === 'plazo_fijo' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Fecha término</label>
                  <input type="date" value={form.fechaTermino} onChange={e => setForm(p => ({ ...p, fechaTermino: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">N° de renovaciones previas</label>
                  <input type="number" min={0} max={5} value={form.renovaciones} onChange={e => setForm(p => ({ ...p, renovaciones: Number(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </>
            )}
            <div className="col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setMostrarForm(false)}
                className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2">Cancelar</button>
              <button type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-5 py-2 rounded-xl">Guardar</button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de trabajadores */}
      <div className="space-y-4">
        {trabajadores.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
            <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No hay trabajadores registrados aún.</p>
          </div>
        )}

        {trabajadores.map(t => {
          const alertas = calcularAlertas(t)
          const tieneRoja = alertas.some(a => a.tipo === 'roja')

          return (
            <div key={t.id} className={`bg-white rounded-2xl border p-5 ${tieneRoja ? 'border-red-200' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{t.nombre}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${t.tipoContrato === 'indefinido' ? 'bg-blue-100 text-blue-700'
                        : t.tipoContrato === 'plazo_fijo' ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-100 text-slate-700'}`}>
                      {t.tipoContrato === 'indefinido' ? 'Indefinido' : t.tipoContrato === 'plazo_fijo' ? 'Plazo fijo' : 'Obra/faena'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{t.cargo} · {tiempoTrabajado(t.fechaInicio)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ingreso: {new Date(t.fechaInicio).toLocaleDateString('es-CL')}
                    {t.fechaTermino && ` → Término: ${new Date(t.fechaTermino).toLocaleDateString('es-CL')}`}
                  </p>
                </div>
                <button onClick={() => eliminar(t.id)}>
                  <Trash2 className="w-4 h-4 text-slate-300 hover:text-red-400 transition-colors" />
                </button>
              </div>

              <div className="space-y-2">
                {alertas.map((a, i) => (
                  <div key={i} className={`flex items-start gap-2 text-xs px-3 py-2 rounded-xl border ${colorAlerta[a.tipo]}`}>
                    {iconoAlerta[a.tipo]}
                    {a.mensaje}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
