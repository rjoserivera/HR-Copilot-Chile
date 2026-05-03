# HR Copilot Chile 🇨🇱

Asistente de Gestión de Personas y Derecho Laboral para PYMEs chilenas.
Desarrollado para el **Hackathon Vercel — Track 2: v0 + MCPs**.

---

## 🚀 Setup rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tu API Key de Anthropic:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Obtén tu clave en: https://console.anthropic.com

### 3. Agregar los PDFs de leyes

Coloca los siguientes archivos en `/context/leyes/`:

| Archivo | Fuente |
|---------|--------|
| `codigo_del_trabajo.pdf` | https://www.dt.gob.cl/legislacion/1624/w3-article-95516.html |
| `ley_19728_afc.pdf` | https://www.bcn.cl/leychile/navegar?idNorma=184979 |
| `ley_21561_40horas.pdf` | https://www.bcn.cl/leychile/navegar?idNorma=1191554 |
| `ley_21643_acoso.pdf` | https://www.bcn.cl/leychile/navegar?idNorma=1200096 |
| `ley_16744_accidentes.pdf` | https://www.bcn.cl/leychile/navegar?idNorma=28650 |
| `dfl44_subsidios.pdf` | https://www.bcn.cl/leychile/navegar?idNorma=6526 |
| `ley_20255_previsional.pdf` | https://www.bcn.cl/leychile/navegar?idNorma=269892 |
| `ley_19518_sence.pdf` | https://www.bcn.cl/leychile/navegar?idNorma=31892 |

> Los PDFs están en .gitignore por su peso. Descárgalos manualmente desde BCN y la Dirección del Trabajo.

### 4. Correr en desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

---

## 📁 Estructura del proyecto

```
hr-copilot/
│
├── app/
│   ├── page.tsx                   # Landing / Home con módulos
│   ├── layout.tsx                 # Layout global
│   ├── globals.css                # Estilos globales
│   │
│   ├── dashboard/
│   │   └── page.tsx               # Chat con el asistente laboral
│   │
│   ├── finiquito/
│   │   └── page.tsx               # Calculadora de finiquito
│   │
│   ├── curriculums/
│   │   └── page.tsx               # Filtro de CVs con IA
│   │
│   ├── alertas/
│   │   └── page.tsx               # Alertas de contratos
│   │
│   ├── sence/
│   │   └── page.tsx               # Orientación capacitación SENCE
│   │
│   └── api/
│       ├── chat/route.ts          # API del asistente (streaming)
│       ├── finiquito/route.ts     # API calculadora finiquito
│       └── analizar-cv/route.ts   # API análisis de CVs con IA
│
├── components/
│   └── Sidebar.tsx                # Navegación lateral compartida
│
├── lib/
│   ├── system-prompt.ts           # System prompt completo del agente
│   └── finiquito.ts               # Lógica de cálculo de finiquito
│
├── context/
│   └── leyes/                     # PDFs de leyes (no se suben al repo)
│       ├── codigo_del_trabajo.pdf
│       ├── ley_19728_afc.pdf
│       └── ... (ver tabla arriba)
│
├── .env.example                   # Variables de entorno de ejemplo
├── .env.local                     # Variables reales (NO commitear)
└── README.md
```

---

## 🧠 Módulos

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| Consulta Laboral | `/dashboard` | Chat con el asistente IA sobre el CT |
| Calculadora de Finiquito | `/finiquito` | Calcula finiquito según causal |
| Filtro de CVs | `/curriculums` | Rankea candidatos con IA |
| Alertas de Contratos | `/alertas` | Monitorea vencimientos y derechos |
| SENCE | `/sence` | Orienta sobre capacitación |

---

## 🌐 Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Subir el proyecto
vercel

# Agregar la variable de entorno en el dashboard
# Settings → Environment Variables → ANTHROPIC_API_KEY
```

O directamente desde el dashboard de Vercel conectando el repositorio de GitHub.

---

## ⚖️ Fuentes legales verificadas

Toda la información está basada en legislación chilena vigente:

- **Código del Trabajo**: https://www.dt.gob.cl/legislacion/1624/w3-article-95516.html
- **Ley 19.728 AFC**: https://www.bcn.cl/leychile/navegar?idNorma=184979
- **Ley 21.561 (40h)**: https://www.bcn.cl/leychile/navegar?idNorma=1191554
- **Ley 21.643 Acoso**: https://www.bcn.cl/leychile/navegar?idNorma=1200096
- **Ley 16.744 Accidentes**: https://www.bcn.cl/leychile/navegar?idNorma=28650
- **DFL 44 Subsidios**: https://www.bcn.cl/leychile/navegar?idNorma=6526
- **Ley 20.255 Previsional**: https://www.bcn.cl/leychile/navegar?idNorma=269892
- **Ley 19.518 SENCE**: https://www.bcn.cl/leychile/navegar?idNorma=31892
- **SENCE Cursos Online**: https://eligetucurso.sence.cl/?program=Cursos%20en%20l%c3%adnea

---

## ⚠️ Aviso legal

Esta herramienta es de orientación y **no reemplaza** a un abogado laboral ni a la Inspección del Trabajo.
Los cálculos son referenciales. Para casos complejos, consultar en [dt.gob.cl](https://www.dt.gob.cl).

---

*Desarrollado para Hackathon Vercel 2025 — Track 2: v0 + MCPs*
