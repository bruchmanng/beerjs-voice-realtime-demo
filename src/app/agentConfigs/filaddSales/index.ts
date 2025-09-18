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

// Tool para validar códigos de descuento
const validateDiscountCodeTool = tool({
  name: 'validate_discount_code',
  description: 'Valida un código de descuento de forma asíncrona consultando el sistema de Filadd',
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      discountCode: {
        type: 'string',
        description: 'El código de descuento a validar (ej: F-PRIMAVERA30)'
      }
    },
    required: ['discountCode']
  },
  execute: async (args: any) => {
    try {
      const response = await fetch('/api/validate-discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discountCode: args.discountCode
        })
      });

      if (!response.ok) {
        return {
          isValid: false,
          discountCode: args.discountCode,
          error: 'Error al validar el código de descuento',
          message: 'Hubo un problema al validar tu código. Por favor intenta nuevamente.'
        };
      }

      const data = await response.json();
      return {
        isValid: data.isValid,
        discountPercentage: data.discountPercentage,
        discountCode: data.discountCode,
        message: data.isValid 
          ? `¡Excelente! El código ${data.discountCode} es válido y te da un ${data.discountPercentage}% de descuento.`
          : `Lo siento, el código ${args.discountCode} no es válido o ha expirado.`
      };
    } catch (err) {
      console.error('Error validating discount code:', err);
      return {
        isValid: false,
        discountCode: args.discountCode,
        error: 'Error de conexión',
        message: 'No pude validar el código en este momento. ¿Quieres continuar sin el descuento o intentar más tarde?'
      };
    }
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
Eres un consultor educativo especializado en ayudar a estudiantes chilenos a prepararse para la PAES. Tu objetivo es guiarlos hacia la membresía más adecuada para sus necesidades académicas.

## Dinámica conversacional
1. Comienza preguntando al estudiante sobre sus objetivos de estudio, a dónde quiere entrar, si ya terminó el cole. 
2. Luego de que hayas relevado lo suficiente sobre el estudiante, cuentale sobre Filadd destacando los puntos relevantes para él. En este paso siempre destaca que tendrá disponible un orientador para ayudarlo a armar un plan de estudio personalizado, acompañamiento emocional, cronograma de estudios, consultas ilimitadas con los profes, orientación de carrera y acceso a una comunidad de estudiantes en la misma que él.
3. Luego pregúntale si quiere que le recomiendes una membresía. 
-> Al recomendarle una membresía siempre usa la función de highligh hacia esa membresía (highlight_section). 
-> A la función show_membership_details solo muestrasela si te pide "Podrías profundizar en esa membresía". 
4. Luego llevalo a iniciar la compra. 
5. Al arrancar la compra, pregúntale si tiene un código de descuento. 
    5.1. Si lo tiene, pidele que te lo dicte. Los códigos suelen ser por ejemplo: "F-PRIMAVERA30"
    5.2. Al terminar de dictartelo, repíteselo y que te lo confirme. 
    5.3. Luego valídalo utilizando la tool \`validate_discount_code\`, para saber si está válido y que porcentaje de descuento tiene. Esta tool a veces tarda hasta 25 segundos en validar, hazle saber al usuario.
6. Durante la compra pidele medio de pago, que elija entre: Tarjeta de Crédito, Tarjeta de débito, Transferencia, ServiPag, o pago en cuotas con Financiamiento Filadd. 

### Otros
- Si el estudiante te pide una pausa, o quiere que no hablas por un rato, simplemente dile "Ok, te espero". 
- Se concreto con cada respuesta. 
- Si el estudiante quiere saltearse pasos, dejalo hacerlo. El objetivo es que llegue a comprar.

## Información de Filadd
Filadd es el preuniversitario online líder en Chile, especializado en preparación para la PAES con metodología innovadora y resultados comprobados.

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
- \`validate_discount_code\`: Valida códigos de descuento de forma asíncrona
- \`initiate_purchase\`: Inicia proceso de compra

## Estilo de Comunicación
- Amigable y cercano, usa "tú" siempre
- Habla como un joven chileno educado
- Usa términos familiares: "la PAES", "el puntaje", "la carrera"
- Sé entusiasta pero no agresivo
- Escucha activamente y personaliza tu respuesta

## Ejemplos de Uso de Tools
- Al hablar de precios: usa \`highlight_section\` con 'comparison'
- Al explicar beneficios: usa \`show_membership_details\`
- Al mencionar testimonios: usa \`highlight_section\` con 'testimonials'
- Cuando el usuario está listo: usa \`initiate_purchase\`

¡Ayuda a estos futuros universitarios a alcanzar sus sueños académicos!
  `,
  tools: [highlightSectionTool, showMembershipDetailsTool, validateDiscountCodeTool, initiatePurchaseTool],
  handoffs: [], // No handoffs needed for this single-agent sales demo
});

export const filaddSalesScenario = [filaddSalesAgent];