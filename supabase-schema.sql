-- =============================================
-- KS CRM — Supabase Schema
-- KS Máquinas Implementos e Irrigação
-- Cacoal — RO
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- USERS PROFILES
-- =============================================
create table public.users_profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null,
  email text not null,
  phone text,
  role text not null check (role in ('admin', 'manager', 'seller', 'technical')),
  position text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- CAMPAIGNS
-- =============================================
create table public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  start_date date,
  end_date date,
  status text default 'ativa' check (status in ('ativa', 'inativa', 'encerrada')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- CUSTOMERS
-- =============================================
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text,
  whatsapp text,
  city text,
  region_line text,
  farm_name text,
  producer_type text check (producer_type in ('cafeicultor','pecuarista','hortifruti','misto','outro')),
  responsible_user_id uuid references public.users_profiles(id),
  funnel_stage text not null default 'novo_contato'
    check (funnel_stage in ('novo_contato','em_atendimento','orcamento_enviado','acompanhamento','venda_realizada','pos_venda','perdido')),
  next_action text,
  next_action_date date,
  notes text,
  status text default 'ativo' check (status in ('ativo', 'inativo')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- CUSTOMER INTERESTS
-- =============================================
create table public.customer_interests (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade not null,
  interest_type text not null check (interest_type in ('irrigacao','sementes','defensivos','adubos','maquinas','stihl','assistencia')),
  created_at timestamptz default now(),
  unique(customer_id, interest_type)
);

-- =============================================
-- CUSTOMER SOURCES
-- =============================================
create table public.customer_sources (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade not null,
  source text,
  campaign_id uuid references public.campaigns(id),
  created_at timestamptz default now()
);

-- =============================================
-- TASKS
-- =============================================
create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete set null,
  responsible_user_id uuid references public.users_profiles(id),
  type text check (type in ('ligar','visitar','orcamento','pos_venda','entrega','assistencia')),
  title text not null,
  description text,
  due_date timestamptz not null,
  status text default 'pendente' check (status in ('pendente','em_andamento','concluida','atrasada','cancelada')),
  priority text default 'media' check (priority in ('baixa','media','alta')),
  google_calendar_event_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- WHATSAPP CONVERSATIONS
-- =============================================
create table public.whatsapp_conversations (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete set null,
  responsible_user_id uuid references public.users_profiles(id),
  status text default 'pendente' check (status in ('respondida','pendente','sem_resposta')),
  last_message text,
  last_interaction_at timestamptz default now(),
  unread_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- WHATSAPP MESSAGES
-- =============================================
create table public.whatsapp_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.whatsapp_conversations(id) on delete cascade not null,
  sender_type text not null check (sender_type in ('customer','user','system')),
  sender_user_id uuid references public.users_profiles(id),
  message_type text default 'text' check (message_type in ('text','image','document','audio')),
  content text,
  media_url text,
  external_message_id text,
  created_at timestamptz default now()
);

-- =============================================
-- VISITS
-- =============================================
create table public.visits (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete set null,
  responsible_user_id uuid references public.users_profiles(id),
  visit_date timestamptz not null,
  objective text,
  result text,
  notes text,
  status text default 'agendada' check (status in ('agendada','realizada','reagendada','cancelada')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- VISIT PHOTOS
-- =============================================
create table public.visit_photos (
  id uuid primary key default uuid_generate_v4(),
  visit_id uuid references public.visits(id) on delete cascade not null,
  photo_url text not null,
  created_at timestamptz default now()
);

-- =============================================
-- QUOTES
-- =============================================
create table public.quotes (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete set null,
  responsible_user_id uuid references public.users_profiles(id),
  product text not null,
  category text check (category in ('irrigacao','sementes','defensivos','fertilizantes','stihl','maquinas','assistencia')),
  value numeric(12,2) default 0,
  status text default 'enviado' check (status in ('enviado','em_negociacao','aprovado','perdido')),
  notes text,
  quote_date date default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- CUSTOMER HISTORY
-- =============================================
create table public.customer_history (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade not null,
  user_id uuid references public.users_profiles(id),
  type text check (type in ('stage_change','transfer','task','visit','quote','message','note','call')),
  title text not null,
  description text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- =============================================
-- INTEGRATIONS
-- =============================================
create table public.integrations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users_profiles(id) on delete cascade not null,
  provider text not null check (provider in ('google_calendar','whatsapp')),
  access_token text,
  refresh_token text,
  external_account_id text,
  status text default 'inactive' check (status in ('active','inactive','error')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, provider)
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table public.users_profiles enable row level security;
alter table public.customers enable row level security;
alter table public.customer_interests enable row level security;
alter table public.tasks enable row level security;
alter table public.whatsapp_conversations enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.visits enable row level security;
alter table public.quotes enable row level security;
alter table public.customer_history enable row level security;
alter table public.campaigns enable row level security;
alter table public.customer_sources enable row level security;
alter table public.visit_photos enable row level security;
alter table public.integrations enable row level security;

-- Helper function: get current user profile
create or replace function public.get_user_role()
returns text as $$
  select role from public.users_profiles where auth_user_id = auth.uid() limit 1;
$$ language sql security definer stable;

-- Users profiles: all authenticated users can see active profiles
create policy "Users can view all profiles" on public.users_profiles
  for select using (auth.uid() is not null);

create policy "Users can update own profile" on public.users_profiles
  for update using (auth_user_id = auth.uid());

create policy "Admins manage all profiles" on public.users_profiles
  for all using (public.get_user_role() = 'admin');

-- Customers: sellers see own, managers/admins see all
create policy "Sellers see own customers" on public.customers
  for select using (
    public.get_user_role() in ('admin','manager')
    or responsible_user_id = (select id from public.users_profiles where auth_user_id = auth.uid())
  );

create policy "Sellers insert customers" on public.customers
  for insert with check (auth.uid() is not null);

create policy "Sellers update own customers" on public.customers
  for update using (
    public.get_user_role() in ('admin','manager')
    or responsible_user_id = (select id from public.users_profiles where auth_user_id = auth.uid())
  );

-- Tasks: similar to customers
create policy "Tasks access" on public.tasks
  for all using (
    public.get_user_role() in ('admin','manager')
    or responsible_user_id = (select id from public.users_profiles where auth_user_id = auth.uid())
  );

-- WhatsApp: all authenticated users
create policy "WhatsApp conversations" on public.whatsapp_conversations
  for all using (auth.uid() is not null);

create policy "WhatsApp messages" on public.whatsapp_messages
  for all using (auth.uid() is not null);

-- Visits
create policy "Visits access" on public.visits
  for all using (
    public.get_user_role() in ('admin','manager')
    or responsible_user_id = (select id from public.users_profiles where auth_user_id = auth.uid())
  );

-- Quotes
create policy "Quotes access" on public.quotes
  for all using (
    public.get_user_role() in ('admin','manager')
    or responsible_user_id = (select id from public.users_profiles where auth_user_id = auth.uid())
  );

-- History, campaigns, etc
create policy "History read" on public.customer_history for select using (auth.uid() is not null);
create policy "History insert" on public.customer_history for insert with check (auth.uid() is not null);
create policy "Campaigns read" on public.campaigns for select using (auth.uid() is not null);
create policy "Campaigns manage" on public.campaigns for all using (public.get_user_role() in ('admin','manager'));
create policy "Customer sources" on public.customer_sources for all using (auth.uid() is not null);
create policy "Customer interests" on public.customer_interests for all using (auth.uid() is not null);
create policy "Visit photos" on public.visit_photos for all using (auth.uid() is not null);
create policy "Integrations" on public.integrations for all using (auth_user_id = auth.uid() or public.get_user_role() = 'admin');

-- =============================================
-- INDEXES
-- =============================================
create index idx_customers_responsible on public.customers(responsible_user_id);
create index idx_customers_funnel_stage on public.customers(funnel_stage);
create index idx_customers_next_action_date on public.customers(next_action_date);
create index idx_tasks_responsible on public.tasks(responsible_user_id);
create index idx_tasks_customer on public.tasks(customer_id);
create index idx_tasks_due_date on public.tasks(due_date);
create index idx_wa_conversations_customer on public.whatsapp_conversations(customer_id);
create index idx_wa_messages_conversation on public.whatsapp_messages(conversation_id);
create index idx_history_customer on public.customer_history(customer_id);
create index idx_visits_customer on public.visits(customer_id);
create index idx_quotes_customer on public.quotes(customer_id);

-- =============================================
-- TRIGGERS: auto updated_at
-- =============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_customers_updated_at before update on public.customers for each row execute function public.handle_updated_at();
create trigger update_tasks_updated_at before update on public.tasks for each row execute function public.handle_updated_at();
create trigger update_quotes_updated_at before update on public.quotes for each row execute function public.handle_updated_at();
create trigger update_visits_updated_at before update on public.visits for each row execute function public.handle_updated_at();
create trigger update_wa_conversations_updated_at before update on public.whatsapp_conversations for each row execute function public.handle_updated_at();

-- =============================================
-- STORAGE BUCKETS
-- =============================================
-- Run via Supabase dashboard or CLI:
-- supabase storage create visit-photos --public
-- supabase storage create customer-docs --public

-- =============================================
-- SEED DATA (funnel stages reference)
-- =============================================
insert into public.campaigns (name, description, start_date, end_date, status) values
  ('Sementes Acácia', 'Campanha de lançamento linha Acácia', '2024-03-01', '2024-04-30', 'encerrada'),
  ('Irrigação Verão', 'Campanha de irrigação pré-chuvas', '2024-09-01', '2024-11-30', 'ativa'),
  ('STIHL Power', 'Promoção linha STIHL ferramentas', '2024-06-01', '2024-07-31', 'ativa');
