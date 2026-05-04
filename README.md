# 🇨🇱 HR Copilot Chile — Vercel Hackathon 2024

<div align="center">
  <img src="https://img.shields.io/badge/Vercel-Black?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/AI_SDK-Blue?style=for-the-badge&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Track_2-v0_%2B_MCP-orange?style=for-the-badge" />
</div>

---

## 🎯 Visión General

**HR Copilot Chile** es una plataforma de inteligencia artificial "stateless" (sin base de datos) diseñada específicamente para automatizar y simplificar las gestiones de Recursos Humanos en PYMEs de Chile. 

Construido bajo el ecosistema de **Vercel (v0 + AI SDK + MCP)**, el sistema permite a los dueños de empresas y gerentes de RRHH navegar la compleja legislación laboral chilena con un asistente experto, calcular finiquitos precisos en segundos y clasificar currículums automáticamente.

## ✨ Características Principales

| Módulo | Descripción | Tecnología |
| :--- | :--- | :--- |
| **💬 Asistente Legal** | Experto en el Código del Trabajo de Chile. Responde sobre vacaciones, fueros y tipos de contrato. | Anthropic + AI SDK |
| **🧮 Calculadora de Finiquito** | Cálculos automáticos de años de servicio, indemnizaciones y vacaciones proporcionales. | React + Zod |
| **📄 Screening de CVs** | Clasificación inteligente de candidatos con interfaces dinámicas expandibles. | v0 + PDF-Parse |
| **🔒 Privacidad Total** | Arquitectura **Stateless**. No guardamos datos, ni chats, ni archivos. Todo se procesa en memoria. | Stateless Arch |

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **UI/UX:** v0.app, Tailwind CSS, Lucide React
- **IA:** Vercel AI SDK 6 + AI Gateway
- **Modelos:** Claude 3.5 Sonnet (Anthropic)
- **Protocolo:** Model Context Protocol (MCP) para extensión de datos.

## 🔒 Privacidad y Seguridad (Zero Database)

En el mundo de los Recursos Humanos, la privacidad es ley. Nuestra arquitectura garantiza la seguridad de la información sensible:
- **Sin Base de Datos:** No almacenamos información personal, RUTs ni historiales.
- **Procesamiento Volátil:** Los datos del chat y los archivos de CV se procesan "al vuelo" y se eliminan al finalizar la sesión.
- **Transparencia:** Al usar MCP y AI Gateway, mantenemos control total sobre cómo fluye la información sin retención de datos.

## 🚀 Instalación Rápida

1. **Clonar y Entrar:**
   ```bash
   git clone https://github.com/tu-usuario/hr-copilot-chile.git
   cd hr-copilot-chile
   ```

2. **Instalar Dependencias:**
   ```bash
   npm install
   ```

3. **Configurar Entorno (`.env.local`):**
   ```env
   AI_GATEWAY_API_KEY=vck_... # Tu llave de Vercel AI Gateway
   NEXT_PUBLIC_APP_NAME="HR Copilot Chile"
   ```

4. **Desplegar:**
   ```bash
   npm run dev
   ```

## 📈 Roadmap del Hackathon

- [x] Generación de UI dinámica con **v0**.
- [x] Implementación de Streaming con **Vercel AI SDK**.
- [x] Lógica de cálculo legal para **Finiquitos**.
- [x] Módulo de **Ranking de CVs** optimizado.
- [x] Integración de **Vercel MCP** para despliegue y logs.

