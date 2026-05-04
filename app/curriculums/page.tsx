'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Users, Upload, Trash2, Star, AlertTriangle, CheckCircle, XCircle, ExternalLink } from 'lucide-react'

interface Candidato {
  nombre: string
  archivo: string
  puntaje: number
  recomendacion: 'Entrevistar' | 'Considerar' | 'Descartar'
  fortalezas: string[]
  brechas: string[]
  resumen: string
}

export default function CurriculumsPage() {
  const [perfil, setPerfil] = useState('')
  const [archivos, setArchivos] = useState<{ nombre: string; texto: string }[]>([])
  const [resultado, setResultado] = useState<Candidato[] | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback((files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        setArchivos(prev => [
          ...prev,
          { nombre: file.name, texto: reader.result as string },
        ])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.txt'], 'application/pdf': ['.pdf'] },
    multiple: true,
  })

  const eliminarArchivo = (nombre: string) =>
    setArchivos(prev => prev.filter(a => a.nombre !== nombre))

  const analizar = async () => {
    if (!perfil.trim() || archivos.length === 0) return
    setCargando(true)
    setError('')
    setResultado(null)

    try {
      const formData = new FormData()
      formData.append('perfilCargo', perfil)
      archivos.forEach(a => {
        formData.append('cvTexto', a.texto)
        formData.append('cvNombre', a.nombre)
      })

      const res = await fetch('/api/analizar-cv', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResultado(data.candidatos)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al analizar')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <h1 className="font-bold text-xl text-slate-900">Filtro de CVs con IA</h1>
        </div>
        <p className="text-sm text-slate-500">
          El agente analiza cada currículum y rankea candidatos según el perfil del cargo.
          No discrimina por criterios prohibidos por el{' '}
          <a href="https://www.dt.gob.cl/legislacion/1624/w3-article-95516.html"
            target="_blank" rel="noopener noreferrer"
            className="text-blue-500 hover:underline inline-flex items-center gap-1">
            Art. 2 del Código del Trabajo <ExternalLink className="w-3 h-3" />
          </a>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Formulario izquierda */}
        <div className="lg:col-span-2 space-y-4">

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Perfil del cargo
            </label>
            <textarea
              value={perfil}
              onChange={e => setPerfil(e.target.value)}
              placeholder="Ej: Técnico en Redes con mínimo 2 años de experiencia, conocimiento en switching y routing, certificación CCNA deseable, trabajo en empresa de telecomunicaciones..."
              rows={5}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 resize-none"
            />
          </div>

          {/* Dropzone */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <label className="block text-sm font-semibold text-slate-800 mb-3">
              Currículums (.txt o .pdf)
            </label>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-violet-400 bg-violet-50' : 'border-slate-200 hover:border-violet-300'}`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">
                {isDragActive ? 'Suelta aquí...' : 'Arrastra CVs o haz clic'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Soporta .txt y .pdf</p>
            </div>

            {archivos.length > 0 && (
              <div className="mt-3 space-y-2">
                {archivos.map(a => (
                  <div key={a.nombre} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                    <span className="text-xs text-slate-600 truncate max-w-[80%]">{a.nombre}</span>
                    <button onClick={() => eliminarArchivo(a.nombre)}>
                      <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={analizar}
            disabled={cargando || !perfil.trim() || archivos.length === 0}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
          >
            {cargando ? 'Analizando CVs...' : `Analizar ${archivos.length} CV${archivos.length !== 1 ? 's' : ''}`}
          </button>
        </div>

        {/* Resultados derecha */}
        <div className="lg:col-span-3 space-y-4">
          {!resultado ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">El ranking de candidatos aparecerá aquí</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500">
                {resultado.length} candidatos analizados — ordenados de mayor a menor match
              </p>
              {resultado.map((c, i) => (
                <TarjetaCandidato key={i} candidato={c} posicion={i + 1} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TarjetaCandidato({ candidato: c, posicion }: { candidato: Candidato; posicion: number }) {
  const [expandido, setExpandido] = useState(false)

  const colorRec = {
    Entrevistar: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Considerar: 'bg-amber-100 text-amber-700 border-amber-200',
    Descartar: 'bg-red-100 text-red-700 border-red-200',
  }[c.recomendacion]

  const iconoRec = {
    Entrevistar: <CheckCircle className="w-3.5 h-3.5" />,
    Considerar: <AlertTriangle className="w-3.5 h-3.5" />,
    Descartar: <XCircle className="w-3.5 h-3.5" />,
  }[c.recomendacion]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm">
            {posicion}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{c.nombre}</p>
            <p className="text-xs text-slate-400">{c.archivo}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-amber-500 mb-1 justify-end">
            <Star className="w-4 h-4 fill-amber-400" />
            <span className="font-bold text-slate-900">{c.puntaje}%</span>
          </div>
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${colorRec}`}>
            {iconoRec}
            {c.recomendacion}
          </span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="h-1.5 bg-slate-100 rounded-full mb-3">
        <div
          className="h-1.5 rounded-full bg-violet-500 transition-all"
          style={{ width: `${c.puntaje}%` }}
        />
      </div>

      <p className="text-xs text-slate-600 mb-3 leading-relaxed">{c.resumen}</p>

      {/* Botón expandir */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="text-xs text-violet-600 hover:text-violet-800 font-medium flex items-center gap-1 transition-colors"
      >
        {expandido ? '▲ Ocultar detalles' : '▼ Ver fortalezas y brechas'}
      </button>

      {expandido && (
        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs font-medium text-emerald-700 mb-1.5">✅ Fortalezas</p>
            <ul className="space-y-1">
              {c.fortalezas.map((f, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-orange-700 mb-1.5">⚠️ Brechas</p>
            <ul className="space-y-1">
              {c.brechas.map((b, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
