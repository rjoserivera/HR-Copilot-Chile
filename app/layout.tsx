import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HR Copilot Chile',
  description: 'Asistente de Gestión de Personas y Derecho Laboral Chileno para PYMEs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
