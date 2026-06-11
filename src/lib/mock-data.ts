import type { UserProfile, Customer, Task, WhatsAppConversation, WhatsAppMessage, Visit, Quote, Campaign, CustomerHistory } from '../types';

export const mockUsers: UserProfile[] = [
  { id: '1', auth_user_id: 'auth1', name: 'Ricardo Silva', email: 'ricardo@ksmaquinas.com.br', phone: '(69) 99999-0001', role: 'admin', position: 'Gerente Geral', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '2', auth_user_id: 'auth2', name: 'Carlos Andrade', email: 'carlos@ksmaquinas.com.br', phone: '(69) 99999-0002', role: 'seller', position: 'Vendedor', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '3', auth_user_id: 'auth3', name: 'Fernanda Costa', email: 'fernanda@ksmaquinas.com.br', phone: '(69) 99999-0003', role: 'seller', position: 'Vendedora', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '4', auth_user_id: 'auth4', name: 'João Técnico', email: 'joao@ksmaquinas.com.br', phone: '(69) 99999-0004', role: 'technical', position: 'Técnico de Campo', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
];

export const mockCustomers: Customer[] = [
  {
    id: '1', name: 'Antônio Pereira da Silva', phone: '(69) 98765-4321', whatsapp: '(69) 98765-4321',
    city: 'Cacoal', region_line: 'Linha 9', farm_name: 'Fazenda Boa Esperança',
    producer_type: 'cafeicultor', responsible_user_id: '2', responsible: mockUsers[1],
    funnel_stage: 'em_atendimento', next_action: 'Enviar orçamento de sistema de irrigação',
    next_action_date: new Date(Date.now() + 2 * 86400000).toISOString(),
    notes: 'Cliente com 80 hectares de café. Muito interessado em irrigação.',
    status: 'ativo', interests: ['irrigacao', 'sementes'], source: 'WhatsApp',
    created_at: '2024-01-15', updated_at: '2024-06-01',
  },
  {
    id: '2', name: 'Maria Aparecida Gomes', phone: '(69) 99888-7766', whatsapp: '(69) 99888-7766',
    city: 'Rolim de Moura', region_line: 'Zona Rural', farm_name: 'Sítio Três Irmãs',
    producer_type: 'hortifruti', responsible_user_id: '3', responsible: mockUsers[2],
    funnel_stage: 'orcamento_enviado', next_action: 'Ligar para saber decisão do orçamento',
    next_action_date: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: 'Aguardando retorno sobre orçamento enviado na semana passada.',
    status: 'ativo', interests: ['irrigacao', 'defensivos'],
    created_at: '2024-02-10', updated_at: '2024-06-02',
  },
  {
    id: '3', name: 'José Carlos Mendonça', phone: '(69) 99777-5544', whatsapp: '(69) 99777-5544',
    city: 'Pimenta Bueno', region_line: 'Ramal da Paz', farm_name: 'Fazenda Santa Cruz',
    producer_type: 'pecuarista', responsible_user_id: '2', responsible: mockUsers[1],
    funnel_stage: 'acompanhamento', next_action: 'Visitar propriedade para ver o estado do gado',
    next_action_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    notes: 'Pecuarista com 200 cabeças. Interesse em STIHL e assistência técnica.',
    status: 'ativo', interests: ['stihl', 'assistencia'],
    created_at: '2024-03-05', updated_at: '2024-06-03',
  },
  {
    id: '4', name: 'Ana Paula Rodrigues', phone: '(69) 98644-3322', whatsapp: '(69) 98644-3322',
    city: 'Cacoal', region_line: 'Linha 14', farm_name: 'Chácara Flor do Campo',
    producer_type: 'misto', responsible_user_id: '3', responsible: mockUsers[2],
    funnel_stage: 'venda_realizada', next_action: 'Fazer pós-venda do sistema instalado',
    next_action_date: new Date(Date.now() + 10 * 86400000).toISOString(),
    notes: 'Comprou sistema de irrigação completo. Instalação realizada.',
    status: 'ativo', interests: ['irrigacao', 'adubos'],
    created_at: '2024-01-20', updated_at: '2024-06-04',
  },
  {
    id: '5', name: 'Pedro Luiz Fonseca', phone: '(69) 99555-1100', whatsapp: '(69) 99555-1100',
    city: 'Cacoal', region_line: 'Centro', farm_name: '',
    producer_type: 'outro', responsible_user_id: '2', responsible: mockUsers[1],
    funnel_stage: 'novo_contato', next_action: 'Entrar em contato para entender necessidade',
    next_action_date: new Date(Date.now() + 1 * 86400000).toISOString(),
    notes: 'Entrou pela loja. Interessado em sementes.',
    status: 'ativo', interests: ['sementes'],
    created_at: '2024-06-05', updated_at: '2024-06-05',
  },
  {
    id: '6', name: 'Luiz Henrique Barros', phone: '(69) 98433-2211', whatsapp: '(69) 98433-2211',
    city: 'Alta Floresta D\'Oeste', region_line: 'Linha Verde', farm_name: 'Fazenda Bonança',
    producer_type: 'cafeicultor', responsible_user_id: '3', responsible: mockUsers[2],
    funnel_stage: 'perdido', next_action: 'Tentar reativar em 60 dias',
    next_action_date: new Date(Date.now() + 60 * 86400000).toISOString(),
    notes: 'Perdeu interesse. Comprou com concorrente.',
    status: 'ativo', interests: ['irrigacao', 'sementes'],
    created_at: '2024-02-15', updated_at: '2024-05-10',
  },
];

export const mockTasks: Task[] = [
  {
    id: '1', customer_id: '1', customer: mockCustomers[0], responsible_user_id: '2', responsible: mockUsers[1],
    type: 'orcamento', title: 'Enviar orçamento irrigação', description: 'Sistema de gotejamento 80ha',
    due_date: new Date(Date.now() + 2 * 86400000).toISOString(), status: 'pendente', priority: 'alta',
    created_at: '2024-06-01', updated_at: '2024-06-01',
  },
  {
    id: '2', customer_id: '2', customer: mockCustomers[1], responsible_user_id: '3', responsible: mockUsers[2],
    type: 'ligar', title: 'Ligar para Maria — decisão orçamento', description: 'Saber se vai fechar o orçamento enviado.',
    due_date: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'atrasada', priority: 'alta',
    created_at: '2024-06-02', updated_at: '2024-06-02',
  },
  {
    id: '3', customer_id: '3', customer: mockCustomers[2], responsible_user_id: '2', responsible: mockUsers[1],
    type: 'visitar', title: 'Visita técnica — José Carlos', description: 'Verificar gado e apresentar STIHL.',
    due_date: new Date(Date.now() + 5 * 86400000).toISOString(), status: 'pendente', priority: 'media',
    created_at: '2024-06-03', updated_at: '2024-06-03',
  },
  {
    id: '4', customer_id: '4', customer: mockCustomers[3], responsible_user_id: '3', responsible: mockUsers[2],
    type: 'pos_venda', title: 'Pós-venda Ana Paula', description: 'Verificar satisfação com sistema instalado.',
    due_date: new Date(Date.now() + 10 * 86400000).toISOString(), status: 'pendente', priority: 'media',
    created_at: '2024-06-04', updated_at: '2024-06-04',
  },
  {
    id: '5', customer_id: '5', customer: mockCustomers[4], responsible_user_id: '2', responsible: mockUsers[1],
    type: 'ligar', title: 'Primeiro contato — Pedro Luiz', description: 'Ligar para entender necessidade.',
    due_date: new Date(Date.now() + 1 * 86400000).toISOString(), status: 'pendente', priority: 'baixa',
    created_at: '2024-06-05', updated_at: '2024-06-05',
  },
];

export const mockConversations: WhatsAppConversation[] = [
  {
    id: 'c1', customer_id: '1', customer: mockCustomers[0], responsible_user_id: '2', responsible: mockUsers[1],
    status: 'pendente', last_message: 'Pode me enviar o orçamento do sistema de gotejamento?',
    last_interaction_at: new Date(Date.now() - 30 * 60000).toISOString(), unread_count: 2,
    created_at: '2024-06-01', updated_at: '2024-06-01',
  },
  {
    id: 'c2', customer_id: '2', customer: mockCustomers[1], responsible_user_id: '3', responsible: mockUsers[2],
    status: 'sem_resposta', last_message: 'Bom dia! Tudo bem por aí?',
    last_interaction_at: new Date(Date.now() - 10 * 86400000).toISOString(), unread_count: 0,
    created_at: '2024-06-01', updated_at: '2024-06-01',
  },
  {
    id: 'c3', customer_id: '3', customer: mockCustomers[2], responsible_user_id: '2', responsible: mockUsers[1],
    status: 'respondida', last_message: 'Ok, até quinta-feira então!',
    last_interaction_at: new Date(Date.now() - 2 * 3600000).toISOString(), unread_count: 0,
    created_at: '2024-06-01', updated_at: '2024-06-01',
  },
  {
    id: 'c4', customer_id: '4', customer: mockCustomers[3], responsible_user_id: '3', responsible: mockUsers[2],
    status: 'respondida', last_message: 'O sistema está funcionando muito bem! Obrigada.',
    last_interaction_at: new Date(Date.now() - 1 * 86400000).toISOString(), unread_count: 0,
    created_at: '2024-06-01', updated_at: '2024-06-01',
  },
];

export const mockMessages: WhatsAppMessage[] = [
  { id: 'm1', conversation_id: 'c1', sender_type: 'customer', message_type: 'text', content: 'Olá, tudo bem? Vim saber sobre irrigação para meu café.', created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: 'm2', conversation_id: 'c1', sender_type: 'user', sender_user_id: '2', sender: mockUsers[1], message_type: 'text', content: 'Bom dia Antônio! Boa tarde. Claro, podemos te ajudar. Quantos hectares de café você tem?', created_at: new Date(Date.now() - 2.5 * 3600000).toISOString() },
  { id: 'm3', conversation_id: 'c1', sender_type: 'customer', message_type: 'text', content: 'São 80 hectares. Estou precisando de um sistema de gotejamento.', created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'm4', conversation_id: 'c1', sender_type: 'user', sender_user_id: '2', sender: mockUsers[1], message_type: 'text', content: 'Perfeito! Para 80 hectares temos ótimas opções. Vou preparar um orçamento completo para você.', created_at: new Date(Date.now() - 1.5 * 3600000).toISOString() },
  { id: 'm5', conversation_id: 'c1', sender_type: 'customer', message_type: 'text', content: 'Pode me enviar o orçamento do sistema de gotejamento?', created_at: new Date(Date.now() - 30 * 60000).toISOString() },
];

export const mockVisits: Visit[] = [
  {
    id: 'v1', customer_id: '3', customer: mockCustomers[2], responsible_user_id: '4', responsible: mockUsers[3],
    visit_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    objective: 'Avaliar o rebanho e apresentar linha STIHL',
    result: '', notes: '', status: 'agendada', photos: [],
    created_at: '2024-06-03', updated_at: '2024-06-03',
  },
  {
    id: 'v2', customer_id: '4', customer: mockCustomers[3], responsible_user_id: '4', responsible: mockUsers[3],
    visit_date: new Date(Date.now() - 7 * 86400000).toISOString(),
    objective: 'Instalação do sistema de irrigação',
    result: 'Sistema instalado com sucesso. Cliente muito satisfeito.',
    notes: 'Próximo passo: pós-venda em 30 dias.', status: 'realizada',
    photos: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2'],
    created_at: '2024-05-28', updated_at: '2024-06-03',
  },
];

export const mockQuotes: Quote[] = [
  {
    id: 'q1', customer_id: '2', customer: mockCustomers[1], responsible_user_id: '3', responsible: mockUsers[2],
    product: 'Sistema de irrigação gotejamento 2ha', category: 'irrigacao', value: 8500,
    status: 'enviado', notes: 'Cliente pediu prazo de 30 dias para decidir.',
    quote_date: new Date(Date.now() - 3 * 86400000).toISOString(),
    created_at: '2024-06-02', updated_at: '2024-06-02',
  },
  {
    id: 'q2', customer_id: '4', customer: mockCustomers[3], responsible_user_id: '3', responsible: mockUsers[2],
    product: 'Sistema de irrigação completo 5ha', category: 'irrigacao', value: 22000,
    status: 'aprovado', notes: 'Venda fechada. Instalação concluída.',
    quote_date: new Date(Date.now() - 15 * 86400000).toISOString(),
    created_at: '2024-05-20', updated_at: '2024-06-03',
  },
];

export const mockCampaigns: Campaign[] = [
  { id: 'camp1', name: 'Sementes Acácia', description: 'Campanha de lançamento linha Acácia', start_date: '2024-03-01', end_date: '2024-04-30', status: 'encerrada', created_at: '2024-03-01', updated_at: '2024-03-01' },
  { id: 'camp2', name: 'Irrigação Verão', description: 'Campanha de irrigação pré-chuvas', start_date: '2024-09-01', end_date: '2024-11-30', status: 'ativa', created_at: '2024-06-01', updated_at: '2024-06-01' },
  { id: 'camp3', name: 'STIHL Power', description: 'Promoção linha STIHL ferramentas', start_date: '2024-06-01', end_date: '2024-07-31', status: 'ativa', created_at: '2024-06-01', updated_at: '2024-06-01' },
];

export const mockHistory: CustomerHistory[] = [
  { id: 'h1', customer_id: '1', user_id: '2', user: mockUsers[1], type: 'stage_change', title: 'Etapa alterada', description: 'Novo Contato → Em Atendimento', created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'h2', customer_id: '1', user_id: '2', user: mockUsers[1], type: 'message', title: 'Mensagem enviada via WhatsApp', description: 'Iniciou conversa sobre irrigação para 80ha de café', created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: 'h3', customer_id: '1', user_id: '2', user: mockUsers[1], type: 'task', title: 'Tarefa criada', description: 'Enviar orçamento de sistema de gotejamento', created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
];
