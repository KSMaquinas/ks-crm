import { useState } from 'react';
import { Send, Paperclip, Image, Mic, Plus, ArrowRightLeft, Eye, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { timeAgo, formatDate, isOverdue } from '../lib/utils';
import { mockMessages } from '../lib/mock-data';
import type { WhatsAppConversation, WhatsAppMessage } from '../types';
import { Badge } from '../components/ui/Badge';
import { FUNNEL_STAGES } from '../lib/constants';
import { useNavigate } from 'react-router-dom';

const statusBadge = {
  respondida: { label: 'Respondida', variant: 'green' as const },
  pendente: { label: 'Pendente', variant: 'orange' as const },
  sem_resposta: { label: 'Sem Resposta', variant: 'red' as const },
};

export function WhatsApp() {
  const { conversations, currentUser, updateConversation } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<WhatsAppConversation | null>(conversations[0] || null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const convMessages = messages.filter(m => m.conversation_id === selected?.id);
  const stage = selected ? FUNNEL_STAGES.find(s => s.id === selected.customer?.funnel_stage) : null;
  const stale = selected ? (Date.now() - new Date(selected.last_interaction_at).getTime()) / 86400000 : 0;

  function sendMessage() {
    if (!message.trim() || !selected || !currentUser) return;
    const newMsg: WhatsAppMessage = {
      id: String(Date.now()), conversation_id: selected.id,
      sender_type: 'user', sender_user_id: currentUser.id, sender: currentUser,
      message_type: 'text', content: message.trim(), created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    updateConversation(selected.id, {
      last_message: message.trim(), last_interaction_at: new Date().toISOString(),
      status: 'respondida', unread_count: 0,
    });
    setMessage('');
  }

  return (
    <div className="h-[calc(100vh-120px)] flex gap-4">
      {/* Conversation list */}
      <div className="w-72 flex-shrink-0 card p-0 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-ks-gray-medium">
          <h2 className="font-semibold text-ks-gray-dark flex items-center gap-2">
            <Phone size={15} className="text-ks-green" /> WhatsApp
          </h2>
          <div className="text-xs text-gray-400 mt-0.5">{conversations.length} conversas</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => {
            const isStale = (Date.now() - new Date(conv.last_interaction_at).getTime()) / 86400000 > 7;
            return (
              <div
                key={conv.id}
                onClick={() => setSelected(conv)}
                className={`p-3 border-b border-ks-gray-light cursor-pointer transition-colors hover:bg-ks-gray-light/50 ${selected?.id === conv.id ? 'bg-ks-green-light border-l-2 border-l-ks-green' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-ks-green flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {conv.customer?.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ks-gray-dark truncate">{conv.customer?.name}</span>
                      <span className="text-xs text-gray-400">{timeAgo(conv.last_interaction_at)}</span>
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">{conv.last_message}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant={statusBadge[conv.status].variant}>{statusBadge[conv.status].label}</Badge>
                      {conv.unread_count > 0 && (
                        <span className="bg-ks-orange text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{conv.unread_count}</span>
                      )}
                      {isStale && <span className="text-ks-danger text-xs">⚠️</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      {selected ? (
        <>
          <div className="flex-1 card p-0 flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="p-3 border-b border-ks-gray-medium flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ks-green flex items-center justify-center text-white font-bold">
                  {selected.customer?.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-ks-gray-dark text-sm">{selected.customer?.name}</div>
                  <div className="text-xs text-gray-400">{selected.customer?.city} · {selected.responsible?.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stale > 10 && (
                  <span className="badge-red text-xs">⚠️ Sem interação há {Math.floor(stale)}d</span>
                )}
                <button className="btn-ghost px-2 py-1.5 text-xs gap-1">
                  <ArrowRightLeft size={12} /> Transferir
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-ks-gray-light/30">
              {convMessages.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">Sem mensagens nesta conversa.</div>
              )}
              {convMessages.map(msg => {
                const isUser = msg.sender_type === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm shadow-sm ${isUser ? 'bg-ks-green text-white rounded-br-sm' : 'bg-white text-ks-gray-dark rounded-bl-sm'}`}>
                      {!isUser && msg.sender_type !== 'system' && (
                        <div className="text-xs font-semibold mb-1 text-ks-green">{selected.customer?.name}</div>
                      )}
                      <div>{msg.content}</div>
                      <div className={`text-xs mt-1 ${isUser ? 'text-white/60' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        {isUser && msg.sender && <> · {msg.sender.name}</>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-ks-gray-medium">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-ks-gray-light text-gray-400 hover:text-ks-green transition-colors" title="Imagem"><Image size={18} /></button>
                <button className="p-2 rounded-lg hover:bg-ks-gray-light text-gray-400 hover:text-ks-green transition-colors" title="Arquivo"><Paperclip size={18} /></button>
                <button className="p-2 rounded-lg hover:bg-ks-gray-light text-gray-400 hover:text-ks-green transition-colors" title="Áudio"><Mic size={18} /></button>
                <input
                  className="flex-1 input"
                  placeholder="Digite uma mensagem..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                />
                <button className="btn-secondary px-3 py-2" onClick={sendMessage} disabled={!message.trim()}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="w-60 flex-shrink-0 space-y-3">
            <div className="card">
              <div className="font-semibold text-ks-gray-dark text-sm mb-3">Cliente</div>
              <div className="space-y-1.5 text-xs text-gray-600">
                <div><span className="text-gray-400">Nome: </span>{selected.customer?.name}</div>
                <div><span className="text-gray-400">Cidade: </span>{selected.customer?.city}</div>
                <div><span className="text-gray-400">Responsável: </span>{selected.responsible?.name}</div>
                {stage && (
                  <div><span className="text-gray-400">Etapa: </span>
                    <span className="font-medium" style={{ color: stage.color }}>{stage.label}</span>
                  </div>
                )}
                {selected.customer && (
                  <div className={`text-xs mt-2 p-2 rounded-lg ${isOverdue(selected.customer.next_action_date) ? 'bg-ks-danger-light text-ks-danger' : 'bg-ks-gray-light text-gray-600'}`}>
                    📅 {selected.customer.next_action}<br />
                    <span className="font-medium">{formatDate(selected.customer.next_action_date)}</span>
                  </div>
                )}
              </div>
              <button
                className="btn-ghost w-full mt-3 text-xs"
                onClick={() => navigate(`/clientes/${selected.customer_id}`)}
              >
                <Eye size={12} /> Ver Ficha Completa
              </button>
            </div>

            <div className="card space-y-2">
              <div className="font-semibold text-ks-gray-dark text-sm">Ações Rápidas</div>
              <button className="w-full btn-primary text-xs py-2 justify-center">
                <Plus size={13} /> Nova Tarefa
              </button>
              <button className="w-full btn-ghost text-xs py-2 justify-center">
                Alterar Etapa
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 card flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Phone size={32} className="mx-auto mb-2 opacity-30" />
            <p>Selecione uma conversa</p>
          </div>
        </div>
      )}
    </div>
  );
}
