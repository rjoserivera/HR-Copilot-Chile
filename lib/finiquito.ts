// lib/finiquito.ts
// Calculadora de finiquito según Código del Trabajo Chile

export interface DatosFiniquito {
  sueldoBruto: number         // Sueldo mensual bruto en CLP
  fechaInicio: Date           // Fecha inicio del contrato
  fechaTermino: Date          // Fecha de término de la relación laboral
  causal: string              // Código de causal (ej: '161', '159-2')
  avisoPrevio: boolean        // ¿Se dio aviso previo de 30 días?
  gratificacionMensual: boolean // ¿Se pagó gratificación mensualmente?
  diasVacacionesPendientes?: number // Si ya se calcularon externamente
}

export interface ResultadoFiniquito {
  vacacionesProporcionales: {
    dias: number
    monto: number
    calculo: string
  }
  gratificacionProporcional: {
    meses: number
    monto: number
    calculo: string
  }
  indemnizacionAnosServicio: {
    anos: number
    monto: number
    calculo: string
    aplica: boolean
  }
  indemnizacionAvisoPrevio: {
    monto: number
    calculo: string
    aplica: boolean
  }
  totalFiniquito: number
  resumen: string[]
  advertencias: string[]
}

/**
 * Calcula los años de servicio considerando fracción > 6 meses como año completo
 */
export function calcularAnosServicio(fechaInicio: Date, fechaTermino: Date): number {
  const msTotal = fechaTermino.getTime() - fechaInicio.getTime()
  const diasTotal = msTotal / (1000 * 60 * 60 * 24)
  const anosCompletos = Math.floor(diasTotal / 365)
  const diasRestantes = diasTotal - anosCompletos * 365
  const mesesRestantes = diasRestantes / 30.44

  // Fracción > 6 meses se redondea a 1 año completo
  if (mesesRestantes > 6) {
    return anosCompletos + 1
  }
  return anosCompletos
}

/**
 * Calcula los días de vacaciones proporcionales
 */
export function calcularVacacionesProporcionales(fechaInicio: Date, fechaTermino: Date): number {
  const msTotal = fechaTermino.getTime() - fechaInicio.getTime()
  const diasTrabajados = msTotal / (1000 * 60 * 60 * 24)
  const diasVacaciones = (diasTrabajados / 365) * 15
  return Math.round(diasVacaciones * 100) / 100
}

/**
 * Determina si corresponde indemnización por años de servicio según causal
 */
function correspondeIndemnizacion(causal: string): boolean {
  return causal === '161' || causal === '163bis' || causal.startsWith('injust')
}

/**
 * Calcula el recargo por despido injustificado
 */
function calcularRecargo(causalOriginal: string): number {
  if (causalOriginal === '161') return 0.30
  if (causalOriginal.startsWith('159') || causalOriginal.startsWith('160')) return 0.50
  return 0.80 // Sin causal
}

/**
 * Calculadora principal de finiquito
 */
export function calcularFiniquito(datos: DatosFiniquito): ResultadoFiniquito {
  const advertencias: string[] = []
  const resumen: string[] = []

  // ── VACACIONES PROPORCIONALES ──
  const diasVacaciones = calcularVacacionesProporcionales(datos.fechaInicio, datos.fechaTermino)
  // Valor día = sueldo / 30 días
  const valorDia = datos.sueldoBruto / 30
  const montoVacaciones = Math.round(diasVacaciones * valorDia)

  const vacacionesProporcionales = {
    dias: diasVacaciones,
    monto: montoVacaciones,
    calculo: `${diasVacaciones.toFixed(2)} días × $${valorDia.toFixed(0)} c/día = $${montoVacaciones.toLocaleString('es-CL')}`,
  }

  // ── GRATIFICACIÓN PROPORCIONAL ──
  let montoGratificacion = 0
  const msTrabajado = datos.fechaTermino.getTime() - datos.fechaInicio.getTime()
  const mesesTrabajados = msTrabajado / (1000 * 60 * 60 * 24 * 30.44)

  // Solo calcular si NO se pagó mensualmente
  if (!datos.gratificacionMensual) {
    // 25% del sueldo mensual × meses trabajados en el año actual
    const mesesEnAnoActual = Math.min(mesesTrabajados % 12, mesesTrabajados)
    montoGratificacion = Math.round(datos.sueldoBruto * 0.25 * mesesEnAnoActual)
    advertencias.push('Verificar tope de 4.75 IMM anual para gratificación en dt.gob.cl')
  } else {
    advertencias.push('Gratificación ya pagada mensualmente → no se calcula nuevamente')
  }

  const gratificacionProporcional = {
    meses: Math.round(mesesTrabajados % 12),
    monto: montoGratificacion,
    calculo: datos.gratificacionMensual
      ? 'Ya pagada mensualmente — $0'
      : `$${datos.sueldoBruto} × 25% × ${(mesesTrabajados % 12).toFixed(1)} meses = $${montoGratificacion.toLocaleString('es-CL')}`,
  }

  // ── INDEMNIZACIÓN POR AÑOS DE SERVICIO ──
  const aplica = correspondeIndemnizacion(datos.causal)
  const anosServicio = calcularAnosServicio(datos.fechaInicio, datos.fechaTermino)
  let montoIndemnizacion = 0

  if (aplica) {
    const anosConTope = Math.min(anosServicio, 11) // Tope legal 11 años
    montoIndemnizacion = datos.sueldoBruto * anosConTope

    if (anosServicio > 11) {
      advertencias.push(`El trabajador tiene ${anosServicio} años → se aplica tope legal de 11 años`)
    }
    advertencias.push('Verificar tope de 90 UF por año en cmfchile.cl')
  }

  const indemnizacionAnosServicio = {
    anos: anosServicio,
    monto: montoIndemnizacion,
    aplica,
    calculo: aplica
      ? `$${datos.sueldoBruto.toLocaleString('es-CL')} × ${Math.min(anosServicio, 11)} años = $${montoIndemnizacion.toLocaleString('es-CL')}`
      : 'No aplica según causal de despido',
  }

  // ── AVISO PREVIO ──
  const aplicaAviso = datos.causal === '161' && !datos.avisoPrevio
  const montoAviso = aplicaAviso ? datos.sueldoBruto : 0

  const indemnizacionAvisoPrevio = {
    monto: montoAviso,
    aplica: aplicaAviso,
    calculo: aplicaAviso
      ? `1 sueldo mensual = $${datos.sueldoBruto.toLocaleString('es-CL')} (no se dio aviso de 30 días)`
      : 'No aplica (se dio aviso previo o la causal no lo requiere)',
  }

  // ── TOTAL ──
  const totalFiniquito =
    montoVacaciones + montoGratificacion + montoIndemnizacion + montoAviso

  // ── RESUMEN ──
  resumen.push(`📋 Años de servicio: ${anosServicio} año(s)`)
  resumen.push(`🏖️ Vacaciones proporcionales: $${montoVacaciones.toLocaleString('es-CL')}`)
  if (!datos.gratificacionMensual) {
    resumen.push(`💰 Gratificación proporcional: $${montoGratificacion.toLocaleString('es-CL')}`)
  }
  if (aplica) {
    resumen.push(`📅 Indemnización años servicio: $${montoIndemnizacion.toLocaleString('es-CL')}`)
  }
  if (aplicaAviso) {
    resumen.push(`⚠️ Aviso previo (sustitutivo): $${montoAviso.toLocaleString('es-CL')}`)
  }
  resumen.push(`💵 TOTAL FINIQUITO: $${totalFiniquito.toLocaleString('es-CL')}`)

  advertencias.push('⚠️ Este cálculo es referencial. El finiquito debe ser firmado ante ministro de fe (notario, inspector del trabajo o dirigente sindical).')

  return {
    vacacionesProporcionales,
    gratificacionProporcional,
    indemnizacionAnosServicio,
    indemnizacionAvisoPrevio,
    totalFiniquito,
    resumen,
    advertencias,
  }
}

/**
 * Valida si un contrato a plazo fijo requiere ser convertido a indefinido
 */
export interface ValidacionPlazoFijo {
  debeSerIndefinido: boolean
  razon: string
  alerta: 'roja' | 'amarilla' | 'verde'
}

export function validarPlazoFijo(
  renovaciones: number,
  continua_tras_vencimiento: boolean,
  dias_para_vencimiento?: number
): ValidacionPlazoFijo {
  if (continua_tras_vencimiento) {
    return {
      debeSerIndefinido: true,
      razon: 'El trabajador continúa trabajando después del vencimiento del plazo → pasó a ser INDEFINIDO (Art. 159 N°4 CT)',
      alerta: 'roja',
    }
  }

  if (renovaciones >= 2) {
    return {
      debeSerIndefinido: true,
      razon: `Se han realizado ${renovaciones} renovaciones. La ley permite solo 1 renovación → el contrato pasó a ser INDEFINIDO (Art. 159 N°4 CT)`,
      alerta: 'roja',
    }
  }

  if (renovaciones === 1 && dias_para_vencimiento !== undefined && dias_para_vencimiento <= 30) {
    return {
      debeSerIndefinido: false,
      razon: `El contrato vence en ${dias_para_vencimiento} días. Si se renueva esta vez, DEBERÁ ser indefinido. Evalúe con tiempo.`,
      alerta: 'amarilla',
    }
  }

  if (dias_para_vencimiento !== undefined && dias_para_vencimiento <= 7) {
    return {
      debeSerIndefinido: false,
      razon: `El contrato vence en ${dias_para_vencimiento} días. Defina si renovará, hará indefinido o terminará.`,
      alerta: 'amarilla',
    }
  }

  return {
    debeSerIndefinido: false,
    razon: 'El contrato está en regla.',
    alerta: 'verde',
  }
}
