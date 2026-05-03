import { generateText } from 'ai'
import type { TextPart, FilePart } from 'ai'
import { NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/system-prompt'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const perfilCargo = formData.get('perfilCargo') as string
    const cvTexts = formData.getAll('cvTexto') as string[]
    const cvNombres = formData.getAll('cvNombre') as string[]

    if (!perfilCargo || cvTexts.length === 0) {
      return NextResponse.json(
        { error: 'Debes ingresar el perfil del cargo y al menos un CV.' },
        { status: 400 }
      )
    }

    const contentParts: (TextPart | FilePart)[] = []

    cvTexts.forEach((dataUrl, i) => {
      const match = dataUrl.match(/^data:(.+);base64,(.+)$/)
      if (match) {
        const mimeType = match[1]
        const base64Data = match[2]
        
        if (mimeType === 'application/pdf') {
          contentParts.push({
            type: 'text',
            text: `(A continuación se adjunta el CV ${i + 1}: ${cvNombres[i] || `Candidato ${i + 1}`})`
          })
          contentParts.push({
            type: 'file',
            data: new Uint8Array(Buffer.from(base64Data, 'base64')),
            mediaType: 'application/pdf',
          })
        } else {
          contentParts.push({
            type: 'text',
            text: `--- CV ${i + 1}: ${cvNombres[i] || `Candidato ${i + 1}`} ---\n${Buffer.from(base64Data, 'base64').toString('utf8')}`
          })
        }
      } else {
        // Fallback si es texto plano viejo
        contentParts.push({
            type: 'text',
            text: `--- CV ${i + 1}: ${cvNombres[i] || `Candidato ${i + 1}`} ---\n${dataUrl}`
        })
      }
    })

    const promptText = `
Analiza los siguientes CVs adjuntos para el cargo descrito. 
Responde SOLO en JSON con este formato exacto, sin texto adicional:

{
  "candidatos": [
    {
      "nombre": "nombre del candidato o 'Candidato 1' si no se identifica",
      "archivo": "nombre del archivo",
      "puntaje": 85,
      "recomendacion": "Entrevistar",
      "fortalezas": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
      "brechas": ["brecha 1", "brecha 2"],
      "resumen": "Un párrafo breve de evaluación"
    }
  ]
}

La recomendación debe ser una de: "Entrevistar", "Considerar", "Descartar"
El puntaje es de 0 a 100.
NUNCA evalúes criterios discriminatorios (edad, sexo, apariencia, religión, estado civil).
Solo evalúa competencias, experiencia y formación relevante para el cargo.

PERFIL DEL CARGO:
${perfilCargo}
`
    contentParts.push({ type: 'text', text: promptText })

    const { text } = await generateText({
      model: 'anthropic/claude-sonnet-4-5',
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: contentParts }]
    })

    // Limpiar posibles backticks de markdown
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()
    const resultado = JSON.parse(cleanText)

    // Ordenar por puntaje descendente
    resultado.candidatos.sort((a: { puntaje: number }, b: { puntaje: number }) => b.puntaje - a.puntaje)

    return NextResponse.json(resultado)
  } catch (error) {
    console.error('Error al analizar CVs:', error)
    return NextResponse.json({ error: 'Error al analizar los CVs. Intenta de nuevo.' }, { status: 500 })
  }
}
