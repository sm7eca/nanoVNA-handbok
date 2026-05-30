-- Starbright Investment Management System
-- Database Schema

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Companies
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_number text,
  country text default 'Sweden',
  city text,
  sector text,
  business_model text,
  website text,
  description text,
  status text default 'lead' check (status in ('lead','active','portfolio','rejected','archived')),
  responsible_im text,
  founder_names text[],
  ceo_name text,
  contact_name text,
  contact_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Deals
create table deals (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  round text,
  capital_need bigint,
  proposed_investment bigint,
  valuation_pre bigint,
  valuation_post bigint,
  instrument text,
  ownership_percentage numeric(5,2),
  deal_source text,
  introduced_by text,
  status text default 'new' check (status in ('new','first_meeting','screening','parked','declined','dd','ik_prep','ik_decision','term_sheet','closing','portfolio','archive')),
  responsible_im text,
  next_step text,
  decision_point date,
  pitch_deck_url text,
  pitch_deck_text text,
  ai_screening jsonb,
  recommendation text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Assessments
create table assessments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  deal_id uuid references deals(id) on delete cascade,
  assessment_type text not null check (assessment_type in ('philosophy_fit','team','risk','esg','moonshot','market','product','financial')),
  ai_proposal jsonb,
  im_assessment jsonb,
  status text default 'ai_generated' check (status in ('not_started','ai_generated','reviewed','approved')),
  source text,
  confidence_level text check (confidence_level in ('high','medium','low','unknown')),
  assessed_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Risks
create table risks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  deal_id uuid references deals(id),
  risk_type text,
  description text not null,
  probability text check (probability in ('high','medium','low')),
  impact text check (impact in ('high','medium','low')),
  risk_level text check (risk_level in ('red','yellow','green')),
  trend text check (trend in ('increasing','stable','decreasing')),
  owner text,
  mitigation text,
  status text default 'open' check (status in ('open','mitigated','closed','accepted')),
  source text default 'ai',
  ai_generated boolean default true,
  im_reviewed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- DD Questions
create table dd_questions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  deal_id uuid references deals(id),
  module text not null,
  question text not null,
  priority text check (priority in ('high','medium','low')),
  status text default 'open' check (status in ('open','answered','not_applicable')),
  answer text,
  source text default 'ai',
  ai_generated boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Decisions
create table decisions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  deal_id uuid references deals(id),
  decision_type text not null,
  decision text not null check (decision in ('proceed','proceed_to_dd','invest','not_invest','invest_with_conditions','park','decline','follow_on','no_follow_on','prepare_exit','first_meeting')),
  decision_date timestamptz default now(),
  decision_maker text,
  rationale text,
  conditions text,
  next_action text,
  ai_summary text,
  created_at timestamptz default now()
);

-- Documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  deal_id uuid references deals(id),
  document_type text,
  filename text,
  file_url text,
  uploaded_by text,
  version integer default 1,
  ai_summary text,
  extracted_data jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index idx_deals_company_id on deals(company_id);
create index idx_deals_status on deals(status);
create index idx_assessments_deal_id on assessments(deal_id);
create index idx_risks_deal_id on risks(deal_id);
create index idx_dd_questions_deal_id on dd_questions(deal_id);
create index idx_decisions_deal_id on decisions(deal_id);

-- Updated at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_companies_updated_at before update on companies
  for each row execute function update_updated_at_column();

create trigger update_deals_updated_at before update on deals
  for each row execute function update_updated_at_column();

create trigger update_assessments_updated_at before update on assessments
  for each row execute function update_updated_at_column();

create trigger update_risks_updated_at before update on risks
  for each row execute function update_updated_at_column();

create trigger update_dd_questions_updated_at before update on dd_questions
  for each row execute function update_updated_at_column();

-- Storage bucket for pitch decks (run in Supabase dashboard or via API)
-- insert into storage.buckets (id, name, public) values ('pitch-decks', 'pitch-decks', false);
