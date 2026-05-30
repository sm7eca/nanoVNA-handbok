export type CompanyStatus = 'lead' | 'active' | 'portfolio' | 'rejected' | 'archived';

export type DealStatus =
  | 'new'
  | 'first_meeting'
  | 'screening'
  | 'parked'
  | 'declined'
  | 'dd'
  | 'ik_prep'
  | 'ik_decision'
  | 'term_sheet'
  | 'closing'
  | 'portfolio'
  | 'archive';

export type AssessmentType =
  | 'philosophy_fit'
  | 'team'
  | 'risk'
  | 'esg'
  | 'moonshot'
  | 'market'
  | 'product'
  | 'financial';

export type AssessmentStatus = 'not_started' | 'ai_generated' | 'reviewed' | 'approved';
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';
export type RiskLevel = 'red' | 'yellow' | 'green';
export type RiskProbability = 'high' | 'medium' | 'low';
export type RiskImpact = 'high' | 'medium' | 'low';
export type RiskStatus = 'open' | 'mitigated' | 'closed' | 'accepted';
export type DDQuestionStatus = 'open' | 'answered' | 'not_applicable';
export type DDQuestionPriority = 'high' | 'medium' | 'low';
export type DecisionValue =
  | 'proceed'
  | 'proceed_to_dd'
  | 'invest'
  | 'not_invest'
  | 'invest_with_conditions'
  | 'park'
  | 'decline'
  | 'follow_on'
  | 'no_follow_on'
  | 'prepare_exit'
  | 'first_meeting';

export interface Company {
  id: string;
  name: string;
  org_number?: string;
  country: string;
  city?: string;
  sector?: string;
  business_model?: string;
  website?: string;
  description?: string;
  status: CompanyStatus;
  responsible_im?: string;
  founder_names?: string[];
  ceo_name?: string;
  contact_name?: string;
  contact_email?: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  company_id: string;
  round?: string;
  capital_need?: number;
  proposed_investment?: number;
  valuation_pre?: number;
  valuation_post?: number;
  instrument?: string;
  ownership_percentage?: number;
  deal_source?: string;
  introduced_by?: string;
  status: DealStatus;
  responsible_im?: string;
  next_step?: string;
  decision_point?: string;
  pitch_deck_url?: string;
  pitch_deck_text?: string;
  ai_screening?: AIScreeningResult;
  recommendation?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined
  company?: Company;
}

export interface AIScreeningResult {
  company_summary: string;
  business_model: string;
  customer_problem: string;
  solution: string;
  market: string;
  team: string;
  capital_need: string;
  strengths: string[];
  risks: string[];
  starbright_fit: string;
  first_meeting_questions: string[];
  recommended_next_step: string;
  recommendation: 'Proceed' | 'Park' | 'Decline' | 'Proceed to DD';
}

export interface Assessment {
  id: string;
  company_id: string;
  deal_id: string;
  assessment_type: AssessmentType;
  ai_proposal?: PhilosophyFitProposal | Record<string, unknown>;
  im_assessment?: Record<string, unknown>;
  status: AssessmentStatus;
  source?: string;
  confidence_level?: ConfidenceLevel;
  assessed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PhilosophyQuestion {
  question: string;
  label: string;
  ai_answer: string;
  traffic_light: 'green' | 'yellow' | 'red';
  confidence: ConfidenceLevel;
  follow_up_questions: string[];
}

export interface PhilosophyFitProposal {
  forstar_vi_affaren: PhilosophyQuestion;
  tror_vi_pa_teamet: PhilosophyQuestion;
  kan_vi_gora_skillnad: PhilosophyQuestion;
  overall_fit: 'green' | 'yellow' | 'red';
  summary: string;
}

export interface Risk {
  id: string;
  company_id: string;
  deal_id?: string;
  risk_type?: string;
  description: string;
  probability?: RiskProbability;
  impact?: RiskImpact;
  risk_level?: RiskLevel;
  trend?: 'increasing' | 'stable' | 'decreasing';
  owner?: string;
  mitigation?: string;
  status: RiskStatus;
  source: string;
  ai_generated: boolean;
  im_reviewed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DDQuestion {
  id: string;
  company_id: string;
  deal_id?: string;
  module: string;
  question: string;
  priority?: DDQuestionPriority;
  status: DDQuestionStatus;
  answer?: string;
  source: string;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Decision {
  id: string;
  company_id: string;
  deal_id?: string;
  decision_type: string;
  decision: DecisionValue;
  decision_date: string;
  decision_maker?: string;
  rationale?: string;
  conditions?: string;
  next_action?: string;
  ai_summary?: string;
  created_at: string;
}

export interface Document {
  id: string;
  company_id: string;
  deal_id?: string;
  document_type?: string;
  filename?: string;
  file_url?: string;
  uploaded_by?: string;
  version: number;
  ai_summary?: string;
  extracted_data?: Record<string, unknown>;
  created_at: string;
}

// Pipeline status labels in Swedish
export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  new: 'Nytt',
  first_meeting: 'Första möte',
  screening: 'Screening',
  parked: 'Parkerad',
  declined: 'Avböjd',
  dd: 'Due Diligence',
  ik_prep: 'Inför IK',
  ik_decision: 'IK-beslut',
  term_sheet: 'Term Sheet',
  closing: 'Avslut',
  portfolio: 'Portfölj',
  archive: 'Arkiv',
};

export const DEAL_SOURCE_LABELS: Record<string, string> = {
  Inbound: 'Inbound',
  Network: 'Nätverk',
  Proactive: 'Proaktiv',
  Referral: 'Referens',
  Event: 'Event',
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  red: 'Hög',
  yellow: 'Medium',
  green: 'Låg',
};

export const DECISION_LABELS: Record<DecisionValue, string> = {
  proceed: 'Gå vidare',
  proceed_to_dd: 'Gå vidare till DD',
  invest: 'Investera',
  not_invest: 'Investera inte',
  invest_with_conditions: 'Investera med villkor',
  park: 'Parkera',
  decline: 'Avböj',
  follow_on: 'Följdinvestering',
  no_follow_on: 'Ingen följdinvestering',
  prepare_exit: 'Förbered exit',
  first_meeting: 'Första möte',
};
