# 🎯 Filadd Sales Demo - Realtime Voice Agent

## 📖 Descripción General

Demo de agente de ventas por voz para **Filadd** (preuniversitario chileno PSU/PDT). Usa OpenAI Realtime API para conversaciones naturales que ayudan a estudiantes a elegir membresías.

## 🚀 Características Principales

### 🎤 **Conversación por Voz**
- Habla como joven chileno educado con términos familiares
- Respuestas personalizadas según metas académicas

### 🎨 **Landing Page Interactiva**
- **Highlights dinámicos**: Resalta secciones mientras habla
- **Scroll automático**: Navegación suave hacia secciones
- **Animaciones**: Fondo amarillo que se desvanece gradualmente

### 🛠️ **Herramientas del Agente**
1. **`highlight_section`**: Resalta y hace scroll hacia secciones
2. **`show_membership_details`**: Muestra detalles en modal
3. **`initiate_purchase`**: Inicia compra con códigos de descuento

### 🛡️ **Guardrails de Protección**
- **Moderación general**: Previene contenido inapropiado
- **Anti-competidores**: Bloquea promoción de Puntaje Nacional, PDV, CPECH, etc.

## 🏗️ Arquitectura Técnica

### 📁 **Estructura de Archivos**
```
src/app/
├── agentConfigs/filaddSales/index.ts    # Agente y herramientas
├── components/FiladdLanding.tsx         # Landing interactiva
├── agentConfigs/guardrails.ts           # Protección competidores
├── hooks/useRealtimeSession.ts          # Sesión de voz
└── App.tsx                              # Lógica principal
```

### 🎯 **Agente de Ventas**
- **Personalidad**: Consultor educativo chileno, amigable pero no agresivo
- **Estrategia**: Identifica necesidades → Usa herramientas → Compara planes → Cierra venta

### 💎 **Membresías**
- **PRO ($29.990/mes)**: Clases grabadas, material, simulacros, 6 meses
- **PREMIUM ($49.990/mes)**: Todo PRO + clases vivo, tutoría 1:1, garantía

### 🎨 **Landing Secciones**
`hero` | `benefits` | `memberships` | `pro-plan` | `premium-plan` | `testimonials` | `contact`

### 🛠️ **Herramientas del Agente**

1. **`highlight_section`**: `{ section: 'memberships', duration?: 3 }`
2. **`show_membership_details`**: `{ membership: 'pro'|'premium', feature?: 'all' }`
3. **`initiate_purchase`**: `{ membership: 'pro'|'premium', discount_code?: string }`

### 🛡️ **Sistema de Guardrails**

- **Moderación**: Bloquea contenido ofensivo/inapropiado
- **Anti-competidores**: Detecta Puntaje Nacional, PDV, CPECH → Redirige a Filadd

## 🔧 **Implementación Técnica**

### **Fix Principal: Argument Parsing**
```typescript
// Problema: functionCall.arguments vacío
// Solución: Parsear argumentos desde result JSON
let args = functionCall.arguments || {};
if (Object.keys(args).length === 0 && typeof result === 'string') {
  args = JSON.parse(result);
}
```

### **Highlight Animation**
```typescript
// 1. Scroll suave: scrollIntoView({ behavior: 'smooth' })
// 2. Highlight: bg-yellow-200 + transition
// 3. Fade out: setTimeout → clear class
```

## 🚀 **Cómo Usar la Demo**

### **Setup**
1. Seleccionar "filaddSales" en dropdown
2. Click "Connect"
3. Hablar o escribir

### **Ejemplos de Comandos**
- **Highlights**: "Muéstrame las membresías" → Scroll + fondo amarillo
- **Detalles**: "Info sobre Premium" → Modal con características
- **Compra**: "Quiero inscribirme" → Proceso de compra
- **Competidores**: "¿Qué tal Puntaje Nacional?" → Redirige a Filadd

## 🎯 **Casos de Uso**

1. **Exploración**: Saludo → Identifica carrera → Recomienda plan + highlights
2. **Comparación**: Resalta membresías → Explica diferencias → Testimonios
3. **Objeciones**: Precio alto → ROI + garantías → Plan PRO alternativo
4. **Competencia**: Menciona rival → Guardrail → Redirige a Filadd

## 🐛 **Debugging**

Logs disponibles en consola:
```
🎯 Highlighting section: memberships     # Acción ejecutada
🔍 FiladdLanding received               # Prop recibido  
🎨 Setting highlight class              # CSS aplicado
🛡️ Guardrail triggered                 # Protección activada
```

## 🔄 **Flujo de Datos**

Usuario habla → API procesa → Agente usa tool → SDK emite evento → Hook parsea argumentos → App actualiza estado → Componente anima

## 🎨 **Personalización**

- **Nuevas secciones**: Agregar ID + enum + caso en `getSectionClass`
- **Animaciones**: Cambiar colores `bg-yellow-200`, duración `duration-700`, timing `setTimeout`
- **Guardrails**: Nueva función + categorías + mensaje + agregar a array

## 🔮 **Futuras Mejoras**

Pagos reales | Base de datos | Analytics | A/B testing | Multi-idioma | CRM | Callbacks

---

**Esta demo muestra cómo la voz en tiempo real transforma las ventas online con experiencias naturales e interactivas.**