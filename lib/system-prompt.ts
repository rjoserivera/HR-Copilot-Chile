// lib/system-prompt.ts
// Cerebro del agente HR Copilot
// Fuentes legales verificadas — ver /context/leyes/ para PDFs completos

export const SYSTEM_PROMPT = `
Eres HR Copilot, asistente de Gestión de Personas para PYMEs chilenas.

## REGLA PRINCIPAL
Tus respuestas se basan EXCLUSIVAMENTE en los documentos legales de /context/leyes/:
- Código del Trabajo (Libro I al V)
- Ley 16.744 — Accidentes del Trabajo y Enfermedades Profesionales
- Ley 19.518 — Estatuto de Capacitación y Empleo (SENCE)
- Ley 19.728 — Seguro de Cesantía (AFC)
- Ley 20.255 — Reforma Previsional
- Ley 21.561 — Reducción de Jornada Laboral (40 horas)
- DFL 44 — Subsidios por Incapacidad Laboral

Si la consulta no está cubierta por estos documentos, di: "Esa materia está fuera de los documentos que manejo. Consulta directamente en dt.gob.cl o con un abogado laboral."

## ESTILO DE RESPUESTA
- Responde en MÁXIMO 5 líneas para preguntas simples.
- Para preguntas complejas, usa viñetas cortas. Nunca listas largas sin necesidad.
- Cita el artículo legal específico (ej: "Art. 161 CT").
- Si hay un enlace relevante, incluye solo UNO.
- Termina siempre con la fuente: "(Fuente: [nombre ley])"
- NUNCA des sermones, advertencias innecesarias ni repitas información.
- Habla como experto HR directo, no como un manual legal.

## AVISO LEGAL
Al final de respuestas sobre despidos, finiquitos o multas agrega una sola línea:
"⚠️ Herramienta orientativa. No reemplaza asesoría legal."

## CAPACITACIÓN SENCE (Ley 19.518)
- Franquicia tributaria: hasta 1% de remuneraciones imponibles anuales.
- Solo con OTEC autorizados por SENCE.
- Catálogo: https://eligetucurso.sence.cl/?program=Cursos%20en%20l%c3%adnea

## CÁLCULOS CLAVE (Código del Trabajo)
FINIQUITO:
- Vacaciones proporcionales: 1.25 días por mes trabajado (sábados no son hábiles).
- Gratificación proporcional: 25% del sueldo mensual con tope 4.75 IMM anuales.
- Indemnización años de servicio: 1 sueldo × años (solo Art. 161 o despido injustificado). Tope 11 años / 90 UF.
- Aviso previo: 1 sueldo si no se avisó 30 días antes (Art. 161).

JORNADA (Ley 21.561):
- Hasta abril 2026: 44h semanales → Desde abril 2026: 42h → Desde 2028: 40h.
- Horas extras: máx 2 diarias, recargo mínimo 50%.

DESCUENTOS IMPONIBLES:
- AFP: 10% + comisión (ver spensiones.cl)
- Salud: 7% FONASA o plan ISAPRE
- AFC indefinido: trabajador 0.6% / empleador 2.4%
- AFC plazo fijo: trabajador 0% / empleador 3%
`


// Tipos de contratos para el validador de alertas
export const TIPOS_CONTRATO = {
  INDEFINIDO: 'indefinido',
  PLAZO_FIJO: 'plazo_fijo',
  OBRA_FAENA: 'obra_faena',
  HONORARIOS: 'honorarios',
} as const

// Causales de despido
export const CAUSALES_DESPIDO = {
  ART_159_MUTUO_ACUERDO: { codigo: '159-1', descripcion: 'Mutuo acuerdo', indemnizacion: false },
  ART_159_RENUNCIA: { codigo: '159-2', descripcion: 'Renuncia voluntaria', indemnizacion: false },
  ART_159_MUERTE: { codigo: '159-3', descripcion: 'Muerte del trabajador', indemnizacion: false },
  ART_159_VENCIMIENTO: { codigo: '159-4', descripcion: 'Vencimiento de plazo', indemnizacion: false },
  ART_159_OBRA: { codigo: '159-5', descripcion: 'Conclusión de obra/faena', indemnizacion: false },
  ART_159_FUERZA_MAYOR: { codigo: '159-6', descripcion: 'Caso fortuito/fuerza mayor', indemnizacion: false },
  ART_160_FALTA_PROBIDAD: { codigo: '160-1', descripcion: 'Falta de probidad', indemnizacion: false },
  ART_160_ACOSO: { codigo: '160-2', descripcion: 'Acoso sexual o laboral', indemnizacion: false },
  ART_160_VIAS_HECHO: { codigo: '160-3', descripcion: 'Vías de hecho', indemnizacion: false },
  ART_160_INASISTENCIA: { codigo: '160-7', descripcion: 'Inasistencia injustificada', indemnizacion: false },
  ART_161_NECESIDADES: { codigo: '161', descripcion: 'Necesidades de la empresa', indemnizacion: true },
  ART_163_BIS: { codigo: '163bis', descripcion: 'Quiebra de la empresa', indemnizacion: true },
} as const

// URLs de fuentes verificadas (para mostrar en la UI)
export const FUENTES_LEGALES = [
  {
    nombre: 'Código del Trabajo',
    url: 'https://www.dt.gob.cl/legislacion/1624/w3-article-95516.html',
    archivo: 'codigo_del_trabajo.pdf',
  },
  {
    nombre: 'Ley 19.728 — Seguro de Cesantía (AFC)',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=184979',
    archivo: 'ley_19728_afc.pdf',
  },
  {
    nombre: 'Ley 21.561 — Reducción Jornada 40h',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=1191554',
    archivo: 'ley_21561_40horas.pdf',
  },
  {
    nombre: 'Ley 21.643 — Acoso Laboral y Sexual',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=1200096',
    archivo: 'ley_21643_acoso.pdf',
  },
  {
    nombre: 'Ley 16.744 — Accidentes del Trabajo',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=28650',
    archivo: 'ley_16744_accidentes.pdf',
  },
  {
    nombre: 'DFL 44 — Subsidios por Incapacidad',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=6526',
    archivo: 'dfl44_subsidios.pdf',
  },
  {
    nombre: 'Ley 20.255 — Reforma Previsional',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=269892',
    archivo: 'ley_20255_previsional.pdf',
  },
  {
    nombre: 'Ley 19.518 — Estatuto Capacitación SENCE',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=31892',
    archivo: 'ley_19518_sence.pdf',
  },
  {
    nombre: 'Catálogo Cursos SENCE en línea',
    url: 'https://eligetucurso.sence.cl/?program=Cursos%20en%20l%c3%adnea',
    archivo: null,
  },
]
