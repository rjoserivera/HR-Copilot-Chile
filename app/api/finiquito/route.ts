import { NextResponse } from 'next/server'
import { calcularFiniquito } from '@/lib/finiquito'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const datos = {
      sueldoBruto: Number(body.sueldoBruto),
      fechaInicio: new Date(body.fechaInicio),
      fechaTermino: new Date(body.fechaTermino),
      causal: body.causal,
      avisoPrevio: body.avisoPrevio === true,
      gratificacionMensual: body.gratificacionMensual === true,
    }

    if (!datos.sueldoBruto || isNaN(datos.fechaInicio.getTime()) || isNaN(datos.fechaTermino.getTime())) {
      return NextResponse.json({ error: 'Datos inválidos. Verifica sueldo y fechas.' }, { status: 400 })
    }

    if (datos.fechaInicio >= datos.fechaTermino) {
      return NextResponse.json({ error: 'La fecha de inicio debe ser anterior a la fecha de término.' }, { status: 400 })
    }

    const resultado = calcularFiniquito(datos)
    return NextResponse.json(resultado)
  } catch (error) {
    console.error('Error al calcular finiquito:', error)
    return NextResponse.json({ error: 'Error interno al calcular el finiquito.' }, { status: 500 })
  }
}
