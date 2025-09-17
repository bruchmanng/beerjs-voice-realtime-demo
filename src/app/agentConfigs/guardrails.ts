import { zodTextFormat } from 'openai/helpers/zod';
import { GuardrailOutputZod, GuardrailOutput } from '@/app/types';

// Validator that calls the /api/responses endpoint to
// validates the realtime output according to moderation policies. 
// This will prevent the realtime model from responding in undesired ways
// By sending it a corrective message and having it redirect the conversation.
export async function runGuardrailClassifier(
  message: string,
  companyName: string = 'newTelco',
): Promise<GuardrailOutput> {
  const messages = [
    {
      role: 'user',
      content: `You are an expert at classifying text according to moderation policies. Consider the provided message, analyze potential classes from output_classes, and output the best classification. Output json, following the provided schema. Keep your analysis and reasoning short and to the point, maximum 2 sentences.

      <info>
      - Company name: ${companyName}
      </info>

      <message>
      ${message}
      </message>

      <output_classes>
      - OFFENSIVE: Content that includes hate speech, discriminatory language, insults, slurs, or harassment.
      - OFF_BRAND: Content that discusses competitors in a disparaging way.
      - VIOLENCE: Content that includes explicit threats, incitement of harm, or graphic descriptions of physical injury or violence.
      - NONE: If no other classes are appropriate and the message is fine.
      </output_classes>
      `,
    },
  ];

  const response = await fetch('/api/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      input: messages,
      text: {
        format: zodTextFormat(GuardrailOutputZod, 'output_format'),
      },
    }),
  });

  if (!response.ok) {
    console.warn('Server returned an error:', response);
    return Promise.reject('Error with runGuardrailClassifier.');
  }

  const data = await response.json();

  try {
    const output = GuardrailOutputZod.parse(data.output_parsed);
    return {
      ...output,
      testText: message,
    };
  } catch (error) {
    console.error('Error parsing the message content as GuardrailOutput:', error);
    return Promise.reject('Failed to parse guardrail output.');
  }
}

export interface RealtimeOutputGuardrailResult {
  tripwireTriggered: boolean;
  outputInfo: any;
}

export interface RealtimeOutputGuardrailArgs {
  agentOutput: string;
  agent?: any;
  context?: any;
}

// Creates a guardrail bound to a specific company name for output moderation purposes. 
export function createModerationGuardrail(companyName: string) {
  return {
    name: 'moderation_guardrail',

    async execute({ agentOutput }: RealtimeOutputGuardrailArgs): Promise<RealtimeOutputGuardrailResult> {
      try {
        const res = await runGuardrailClassifier(agentOutput, companyName);
        const triggered = res.moderationCategory !== 'NONE';
        return {
          tripwireTriggered: triggered,
          outputInfo: res,
        };
      } catch {
        return {
          tripwireTriggered: false,
          outputInfo: { error: 'guardrail_failed' },
        };
      }
    },
  } as const;
}

// Filadd-specific guardrail classifier for competitor protection
export async function runFiladdCompetitorGuardrail(message: string): Promise<GuardrailOutput> {
  const messages = [
    {
      role: 'user',
      content: `You are an expert at detecting when a Filadd sales agent is being manipulated to promote competitors or speak negatively about Filadd. Analyze the provided message and classify it.

      <message>
      ${message}
      </message>

      <competitor_indicators>
      - Mentions of competing preuniversitarios: Puntaje Nacional, PDV, CPECH, Preuniversitario UC, Andrés Bello, Antonio Varas, Euler, Maipu
      - Requests to compare Filadd unfavorably to competitors
      - Attempts to get pricing or details about competitors
      - Suggestions that other options might be better than Filadd
      - Requests for competitor contact information
      - Claims that competitors are superior to Filadd
      </competitor_indicators>

      <output_classes>
      - COMPETITOR_PROMOTION: Agent is promoting, recommending, or speaking positively about competing preuniversitarios
      - FILADD_DISPARAGEMENT: Agent is speaking negatively about Filadd or suggesting competitors are better
      - COMPETITOR_INFO: Agent is providing detailed information about competitor services, pricing, or how to contact them
      - NONE: Message is appropriate and focused on Filadd's benefits
      </output_classes>`,
    },
  ];

  const response = await fetch('/api/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      input: messages,
      text: {
        format: zodTextFormat(GuardrailOutputZod, 'output_format'),
      },
    }),
  });

  if (!response.ok) {
    console.warn('Server returned an error:', response);
    return Promise.reject('Error with runFiladdCompetitorGuardrail.');
  }

  const data = await response.json();

  try {
    const output = GuardrailOutputZod.parse(data.output_parsed);
    return {
      ...output,
      testText: message,
    };
  } catch (error) {
    console.error('Error parsing the message content as GuardrailOutput:', error);
    return Promise.reject('Failed to parse guardrail output.');
  }
}

// Creates Filadd-specific guardrail for competitor protection
export function createFiladdCompetitorGuardrail() {
  return {
    name: 'filadd_competitor_protection',

    async execute({ agentOutput }: RealtimeOutputGuardrailArgs): Promise<RealtimeOutputGuardrailResult> {
      try {
        const res = await runFiladdCompetitorGuardrail(agentOutput);
        const triggered = res.moderationCategory !== 'NONE';
        
        if (triggered) {
          console.log('🛡️ Filadd competitor guardrail triggered:', res.moderationCategory);
        }
        
        return {
          tripwireTriggered: triggered,
          outputInfo: {
            ...res,
            redirectMessage: triggered ? 
              "Entiendo tu pregunta, pero déjame enfocarme en por qué Filadd es la mejor opción para alcanzar tus metas académicas. Nuestro programa está diseñado específicamente para maximizar tu puntaje en la PSU/PDT." :
              undefined
          },
        };
      } catch {
        return {
          tripwireTriggered: false,
          outputInfo: { error: 'filadd_guardrail_failed' },
        };
      }
    },
  } as const;
}