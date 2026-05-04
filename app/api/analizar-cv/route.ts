import { generateText } from 'ai'
import { NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/system-prompt'
import pdf from 'pdf-parse'

export const maxDuration = 60

async function extractTextFromDataUrl(dataUrl: string, fileName: string): Promise<string> {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/)
  
  if (!match) {
    // Fallback: es texto plano
    return dataUrl
  }
  
  const mimeType = match[1]
  const base64Data = match[2]
  const buffer = Buffer.from(base64Data, 'base64')
  
  if (mimeType === 'application/pdf') {
    try {
      const pdfData = await pdf(buffer)
      return pdfData.text || `[No se pudo extraer texto del PDF: ${fileName}]`
    } catch (error) {
      console.error(`Error parsing PDF ${fileName}:`, error)
      return `[Error al leer el PDF: ${fileName}]`
    }
  }
  
  // Para otros tipos (txt), decodificar como texto
  return buffer.toString('utf8')
}

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

    // Extraer texto de todos los CVs
    const cvsContenido: string[] = []
    for (let i = 0; i < cvTexts.length; i++) {
      const texto = await extractTextFromDataUrl(cvTexts[i], cvNombres[i] || `Candidato ${i + 1}`)
      cvsContenido.push(`--- CV ${i + 1}: ${cvNombres[i] || `Candidato ${i + 1}`} ---\n${texto}`)
    }

    const prompt = `
Analiza los siguientes CVs para el cargo descrito. 
Responde SOLO en JSON con este formato exacto, sin texto adicional ni backticks:

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

CURRÍCULUMS A ANALIZAR:
${cvsContenido.join('\n\n')}
`

    const { text } = await generateText({
      model: 'anthropic/claude-sonnet-4.5',
      system: SYSTEM_PROMPT,
      prompt: prompt,
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
