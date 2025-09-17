import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Tool para hacer highlight de secciones de la landing page
const highlightSectionTool = tool({
  name: 'highlight_section',
  description: 'Resalta una sección específica de la landing page de Filadd mientras hablas',
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      section: {
        type: 'string',
        enum: ['hero', 'memberships', 'pro-plan', 'premium-plan', 'testimonials', 'contact', 'benefits', 'comparison'],
        description: 'La sección de la landing page a resaltar'
      },
      duration: {
        type: 'number',
        description: 'Duración del highlight en segundos (por defecto 3 segundos)',
        default: 3
      }
    },
    required: ['section']
  },
  execute: async (args: any) => {
    // Esta función se ejecutará cuando el agente use la tool
    // Los event handlers en el App.tsx capturarán esto
    return {
      section: args.section,
      duration: args.duration || 3,
      message: `Resaltando sección: ${args.section}`
    };
  }
});

// Tool para mostrar detalles específicos de membresías
const showMembershipDetailsTool = tool({
  name: 'show_membership_details',
  description: 'Muestra detalles específicos de una membresía en un modal o área destacada',
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      membership: {
        type: 'string',
        enum: ['pro', 'premium'],
        description: 'El tipo de membresía para mostrar detalles'
      },
      feature: {
        type: 'string',
        enum: ['price', 'subjects', 'practice-exams', 'support', 'all'],
        description: 'Característica específica a destacar, o "all" para mostrar todo'
      }
    },
    required: ['membership']
  },
  execute: async (args: any) => {
    return {
      membership: args.membership,
      feature: args.feature || 'all',
      message: `Mostrando detalles de membresía ${args.membership}`
    };
  }
});

// Tool para simular proceso de inscripción
const initiatePurchaseTool = tool({
  name: 'initiate_purchase',
  description: 'Inicia el proceso de compra para una membresía específica',
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      membership: {
        type: 'string',
        enum: ['pro', 'premium'],
        description: 'El tipo de membresía que el usuario quiere comprar'
      },
      discount_code: {
        type: 'string',
        description: 'Código de descuento si se menciona'
      }
    },
    required: ['membership']
  },
  execute: async (args: any) => {
    return {
      membership: args.membership,
      discount_code: args.discount_code,
      message: `Iniciando compra para membresía ${args.membership}${args.discount_code ? ` con código ${args.discount_code}` : ''}`
    };
  }
});

export const filaddSalesAgent = new RealtimeAgent({
  name: 'filaddSales',
  handoffDescription: 'Agente de ventas especializado en cursos preuniversitarios de Filadd',
  instructions: `
# Eres el Agente de Ventas de Filadd - Preuniversitario de Chile

## Tu Rol
Eres un consultor educativo especializado en ayudar a estudiantes chilenos a prepararse para la PSU/PDT. Tu objetivo es guiarlos hacia la membresía más adecuada para sus necesidades académicas.

## Información de Filadd
Filadd es el preuniversitario online líder en Chile, especializado en preparación para la PSU/PDT con metodología innovadora y resultados comprobados.

### Membresía PRO ($29.990/mes)
- Acceso a clases grabadas de todas las materias
- Material de estudio descargable
- Simulacros semanales
- Soporte por chat
- Acceso por 6 meses

### Membresía PREMIUM ($49.990/mes)
- Todo lo de PRO +
- Clases en vivo con profesores
- Sesiones de repaso personalizadas
- Tutoría 1:1 semanal
- Acceso ilimitado
- Garantía de puntaje o devolución

## Tu Estrategia de Ventas
1. **Saluda cordialmente** y pregunta sobre sus metas académicas
2. **Identifica necesidades**: ¿Qué carrera quiere estudiar? ¿Cuál es su puntaje objetivo?
3. **Usa las tools** para hacer highlights relevantes mientras hablas
4. **Compara membresías** destacando beneficios específicos para su situación
5. **Maneja objeciones** con empatía y datos concretos
6. **Cierra la venta** ofreciendo la mejor opción para el estudiante

## Tools Disponibles
- \`highlight_section\`: Resalta secciones de la landing mientras hablas
- \`show_membership_details\`: Muestra detalles específicos de membresías  
- \`initiate_purchase\`: Inicia proceso de compra

## Estilo de Comunicación
- Amigable y cercano, usa "tú" siempre
- Habla como un joven chileno educado
- Usa términos familiares: "la PSU", "el puntaje", "la carrera"
- Sé entusiasta pero no agresivo
- Escucha activamente y personaliza tu respuesta

## Ejemplos de Uso de Tools
- Al hablar de precios: usa \`highlight_section\` con 'comparison'
- Al explicar beneficios: usa \`show_membership_details\`
- Al mencionar testimonios: usa \`highlight_section\` con 'testimonials'
- Cuando el usuario está listo: usa \`initiate_purchase\`

¡Ayuda a estos futuros universitarios a alcanzar sus sueños académicos!
  `,
  tools: [highlightSectionTool, showMembershipDetailsTool, initiatePurchaseTool],
  handoffs: [], // No handoffs needed for this single-agent sales demo
});

export const filaddSalesScenario = [filaddSalesAgent];