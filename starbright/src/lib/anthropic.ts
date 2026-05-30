import Anthropic from '@anthropic-ai/sdk';
import type { AIScreeningResult, PhilosophyFitProposal, Risk, DDQuestion } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function screenDeal(
  pitchDeckText: string,
  companyName: string,
  notes?: string
): Promise<AIScreeningResult> {
  const prompt = `Du är en erfaren venture capital-analytiker på Starbright, ett svenskt venture capital-bolag som fokuserar på aktivt ägande i nordiska tillväxtbolag.

Analysera följande pitch deck för bolaget "${companyName}" och ge en strukturerad bedömning.
${notes ? `\nExtra information från Investment Manager: ${notes}` : ''}

PITCH DECK TEXT:
${pitchDeckText.slice(0, 15000)}

Svara ENBART med ett JSON-objekt i följande format (inga kommentarer, ingen extra text):
{
  "company_summary": "2-3 meningar om vad bolaget gör",
  "business_model": "Hur bolaget tjänar pengar",
  "customer_problem": "Vilket problem löser bolaget för sina kunder?",
  "solution": "Vad är produkten/lösningen?",
  "market": "Marknad, TAM och position",
  "team": "Teamet - bakgrund, erfarenhet, relevans",
  "capital_need": "Hur mycket kapital söker de och till vad?",
  "strengths": ["Styrka 1", "Styrka 2", "Styrka 3"],
  "risks": ["Risk 1", "Risk 2", "Risk 3"],
  "starbright_fit": "Hur väl passar bolaget Starbrights investeringsfilosofi och aktiva ägandemodell?",
  "first_meeting_questions": ["Fråga 1", "Fråga 2", "Fråga 3", "Fråga 4", "Fråga 5"],
  "recommended_next_step": "Konkret rekommendation för nästa steg",
  "recommendation": "Proceed" | "Park" | "Decline" | "Proceed to DD"
}`;

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Kunde inte parsa AI-svar');
  return JSON.parse(jsonMatch[0]) as AIScreeningResult;
}

export async function assessPhilosophyFit(
  screening: AIScreeningResult,
  companyName: string
): Promise<PhilosophyFitProposal> {
  const prompt = `Du är en partner på Starbright, ett venture capital-bolag med en tydlig investeringsfilosofi baserad på tre frågor:

1. FÖRSTÅR VI AFFÄREN? - Kan vi förstå och förklara affären enkelt? Är affärsmodellen begriplig? Finns det en tydlig väg till lönsamhet?
2. TROR VI PÅ TEAMET? - Har teamet rätt kompetens, erfarenhet och driv? Är de coachbara? Kan de rekrytera och skala?
3. KAN VÅRT AKTIVA ÄGANDE GÖRA SKILLNAD? - Kan Starbright bidra med mer än kapital? Säljstruktur, kapitalstrategi, nätverk, rekrytering?

Här är screeningresultatet för bolaget "${companyName}":
${JSON.stringify(screening, null, 2)}

Svara ENBART med ett JSON-objekt:
{
  "forstar_vi_affaren": {
    "question": "Förstår vi affären?",
    "label": "Förstår vi affären?",
    "ai_answer": "Analys av hur väl vi förstår affären (2-3 meningar)",
    "traffic_light": "green" | "yellow" | "red",
    "confidence": "high" | "medium" | "low",
    "follow_up_questions": ["Fråga 1", "Fråga 2"]
  },
  "tror_vi_pa_teamet": {
    "question": "Tror vi på teamet?",
    "label": "Tror vi på teamet?",
    "ai_answer": "Analys av teamet baserat på tillgänglig information (2-3 meningar)",
    "traffic_light": "green" | "yellow" | "red",
    "confidence": "high" | "medium" | "low",
    "follow_up_questions": ["Fråga 1", "Fråga 2"]
  },
  "kan_vi_gora_skillnad": {
    "question": "Kan vi göra skillnad?",
    "label": "Kan vårt aktiva ägande göra skillnad?",
    "ai_answer": "Analys av hur Starbright kan bidra (2-3 meningar)",
    "traffic_light": "green" | "yellow" | "red",
    "confidence": "high" | "medium" | "low",
    "follow_up_questions": ["Fråga 1", "Fråga 2"]
  },
  "overall_fit": "green" | "yellow" | "red",
  "summary": "Sammanfattande bedömning av filosofi-fit (2-3 meningar)"
}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Kunde inte parsa AI-svar');
  return JSON.parse(jsonMatch[0]) as PhilosophyFitProposal;
}

export async function identifyRisks(
  screening: AIScreeningResult,
  companyName: string
): Promise<Omit<Risk, 'id' | 'company_id' | 'deal_id' | 'created_at' | 'updated_at'>[]> {
  const prompt = `Du är riskanalytiker på Starbright. Analysera följande investeringscase för "${companyName}" och identifiera de viktigaste riskerna.

Screeningresultat:
${JSON.stringify(screening, null, 2)}

Identifiera 6-10 risker. Risktyper att överväga: Teamrisk, Finansiell risk, Kommersiell risk, Teknikrisk, Produkt-/marknadsrisk, Juridisk risk, ESG-risk, Finansieringsrisk, Exit-risk.

Svara ENBART med ett JSON-array:
[
  {
    "risk_type": "Kommersiell risk",
    "description": "Detaljerad beskrivning av risken",
    "probability": "high" | "medium" | "low",
    "impact": "high" | "medium" | "low",
    "risk_level": "red" | "yellow" | "green",
    "trend": "stable",
    "mitigation": "Förslag på hur risken kan hanteras",
    "status": "open",
    "source": "ai",
    "ai_generated": true,
    "im_reviewed": false
  }
]`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Kunde inte parsa AI-svar');
  return JSON.parse(jsonMatch[0]);
}

export async function generateDDQuestions(
  screening: AIScreeningResult,
  risks: Pick<Risk, 'risk_type' | 'description'>[],
  companyName: string
): Promise<Omit<DDQuestion, 'id' | 'company_id' | 'deal_id' | 'created_at' | 'updated_at'>[]> {
  const prompt = `Du är due diligence-ansvarig på Starbright. Baserat på screeningresultatet och riskerna för "${companyName}", generera relevanta DD-frågor.

Screening:
${JSON.stringify(screening, null, 2)}

Identifierade risker:
${JSON.stringify(risks, null, 2)}

Generera 15-25 DD-frågor fördelade på moduler: Marknad, Kund, Produkt, Team, Kommersiellt, Finansiellt, Juridiskt, ESG.

Svara ENBART med ett JSON-array:
[
  {
    "module": "Finansiellt",
    "question": "Konkret fråga till bolaget",
    "priority": "high" | "medium" | "low",
    "status": "open",
    "source": "ai",
    "ai_generated": true
  }
]`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Kunde inte parsa AI-svar');
  return JSON.parse(jsonMatch[0]);
}
