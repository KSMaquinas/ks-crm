import type { FunnelStage, ProducerType, InterestType, TaskType, TaskStatus, TaskPriority, QuoteCategory, QuoteStatus, VisitStatus, ConversationStatus } from '../types';

export const FUNNEL_STAGES: { id: FunnelStage; label: string; color: string }[] = [
  { id: 'novo_contato', label: 'Novo Contato', color: '#6B7280' },
  { id: 'em_atendimento', label: 'Em Atendimento', color: '#3B82F6' },
  { id: 'orcamento_enviado', label: 'Orçamento Enviado', color: '#F59E0B' },
  { id: 'acompanhamento', label: 'Acompanhamento', color: '#8B5CF6' },
  { id: 'venda_realizada', label: 'Venda Realizada', color: '#007A43' },
  { id: 'pos_venda', label: 'Pós-venda', color: '#06B6D4' },
  { id: 'perdido', label: 'Perdido', color: '#DC3545' },
];

export const PRODUCER_TYPES: { id: ProducerType; label: string }[] = [
  { id: 'cafeicultor', label: 'Cafeicultor' },
  { id: 'pecuarista', label: 'Pecuarista' },
  { id: 'hortifruti', label: 'Hortifruti' },
  { id: 'misto', label: 'Misto' },
  { id: 'outro', label: 'Outro' },
];

export const INTERESTS: { id: InterestType; label: string; emoji: string }[] = [
  { id: 'irrigacao', label: 'Irrigação', emoji: '💧' },
  { id: 'sementes', label: 'Sementes', emoji: '🌱' },
  { id: 'defensivos', label: 'Defensivos Agrícolas', emoji: '🛡️' },
  { id: 'adubos', label: 'Adubos e Fertilizantes', emoji: '🌿' },
  { id: 'maquinas', label: 'Máquinas', emoji: '🚜' },
  { id: 'stihl', label: 'STIHL', emoji: '⚙️' },
  { id: 'assistencia', label: 'Assistência Técnica', emoji: '🔧' },
];

export const TASK_TYPES: { id: TaskType; label: string }[] = [
  { id: 'ligar', label: 'Ligar para cliente' },
  { id: 'visitar', label: 'Fazer visita' },
  { id: 'orcamento', label: 'Enviar orçamento' },
  { id: 'pos_venda', label: 'Realizar pós-venda' },
  { id: 'entrega', label: 'Entrega' },
  { id: 'assistencia', label: 'Assistência técnica' },
];

export const TASK_STATUSES: { id: TaskStatus; label: string }[] = [
  { id: 'pendente', label: 'Pendente' },
  { id: 'em_andamento', label: 'Em andamento' },
  { id: 'concluida', label: 'Concluída' },
  { id: 'atrasada', label: 'Atrasada' },
  { id: 'cancelada', label: 'Cancelada' },
];

export const TASK_PRIORITIES: { id: TaskPriority; label: string }[] = [
  { id: 'baixa', label: 'Baixa' },
  { id: 'media', label: 'Média' },
  { id: 'alta', label: 'Alta' },
];

export const QUOTE_CATEGORIES: { id: QuoteCategory; label: string }[] = [
  { id: 'irrigacao', label: 'Irrigação' },
  { id: 'sementes', label: 'Sementes' },
  { id: 'defensivos', label: 'Defensivos' },
  { id: 'fertilizantes', label: 'Fertilizantes' },
  { id: 'stihl', label: 'STIHL' },
  { id: 'maquinas', label: 'Máquinas' },
  { id: 'assistencia', label: 'Assistência Técnica' },
];

export const QUOTE_STATUSES: { id: QuoteStatus; label: string }[] = [
  { id: 'enviado', label: 'Enviado' },
  { id: 'em_negociacao', label: 'Em negociação' },
  { id: 'aprovado', label: 'Aprovado' },
  { id: 'perdido', label: 'Perdido' },
];

export const VISIT_STATUSES: { id: VisitStatus; label: string }[] = [
  { id: 'agendada', label: 'Agendada' },
  { id: 'realizada', label: 'Realizada' },
  { id: 'reagendada', label: 'Reagendada' },
  { id: 'cancelada', label: 'Cancelada' },
];

export const CONVERSATION_STATUSES: { id: ConversationStatus; label: string }[] = [
  { id: 'respondida', label: 'Respondida' },
  { id: 'pendente', label: 'Pendente' },
  { id: 'sem_resposta', label: 'Sem Resposta' },
];

export const SOURCES = ['Instagram', 'WhatsApp', 'Grupo de Promoções', 'Ligação', 'Visita', 'Feira', 'Indicação'];
