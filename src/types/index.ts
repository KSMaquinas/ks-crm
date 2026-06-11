export type UserRole = 'admin' | 'manager' | 'seller' | 'technical';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  position: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProducerType = 'cafeicultor' | 'pecuarista' | 'hortifruti' | 'misto' | 'outro';
export type InterestType = 'irrigacao' | 'sementes' | 'defensivos' | 'adubos' | 'maquinas' | 'stihl' | 'assistencia';
export type FunnelStage = 'novo_contato' | 'em_atendimento' | 'orcamento_enviado' | 'acompanhamento' | 'venda_realizada' | 'pos_venda' | 'perdido';
export type CustomerStatus = 'ativo' | 'inativo';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  city: string;
  region_line: string;
  farm_name: string;
  producer_type: ProducerType;
  responsible_user_id: string;
  responsible?: UserProfile;
  funnel_stage: FunnelStage;
  next_action: string;
  next_action_date: string;
  notes: string;
  status: CustomerStatus;
  interests: InterestType[];
  source?: string;
  campaign_id?: string;
  created_at: string;
  updated_at: string;
}

export type TaskType = 'ligar' | 'visitar' | 'orcamento' | 'pos_venda' | 'entrega' | 'assistencia';
export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida' | 'atrasada' | 'cancelada';
export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  customer_id: string;
  customer?: Customer;
  responsible_user_id: string;
  responsible?: UserProfile;
  type: TaskType;
  title: string;
  description: string;
  due_date: string;
  status: TaskStatus;
  priority: TaskPriority;
  google_calendar_event_id?: string;
  created_at: string;
  updated_at: string;
}

export type ConversationStatus = 'respondida' | 'pendente' | 'sem_resposta';
export type MessageType = 'text' | 'image' | 'document' | 'audio';
export type SenderType = 'customer' | 'user' | 'system';

export interface WhatsAppConversation {
  id: string;
  customer_id: string;
  customer?: Customer;
  responsible_user_id: string;
  responsible?: UserProfile;
  status: ConversationStatus;
  last_message: string;
  last_interaction_at: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppMessage {
  id: string;
  conversation_id: string;
  sender_type: SenderType;
  sender_user_id?: string;
  sender?: UserProfile;
  message_type: MessageType;
  content: string;
  media_url?: string;
  external_message_id?: string;
  created_at: string;
}

export type VisitStatus = 'agendada' | 'realizada' | 'reagendada' | 'cancelada';

export interface Visit {
  id: string;
  customer_id: string;
  customer?: Customer;
  responsible_user_id: string;
  responsible?: UserProfile;
  visit_date: string;
  objective: string;
  result: string;
  notes: string;
  status: VisitStatus;
  photos: string[];
  created_at: string;
  updated_at: string;
}

export type QuoteStatus = 'enviado' | 'em_negociacao' | 'aprovado' | 'perdido';
export type QuoteCategory = 'irrigacao' | 'sementes' | 'defensivos' | 'fertilizantes' | 'stihl' | 'maquinas' | 'assistencia';

export interface Quote {
  id: string;
  customer_id: string;
  customer?: Customer;
  responsible_user_id: string;
  responsible?: UserProfile;
  product: string;
  category: QuoteCategory;
  value: number;
  status: QuoteStatus;
  notes: string;
  quote_date: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'ativa' | 'inativa' | 'encerrada';
  created_at: string;
  updated_at: string;
}

export type HistoryType = 'stage_change' | 'transfer' | 'task' | 'visit' | 'quote' | 'message' | 'note' | 'call';

export interface CustomerHistory {
  id: string;
  customer_id: string;
  user_id: string;
  user?: UserProfile;
  type: HistoryType;
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
