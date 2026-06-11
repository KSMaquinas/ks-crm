import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { WhatsAppConversation, WhatsAppMessage } from '../types';

export function useConversations() {
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('whatsapp_conversations')
      .select('*, customer:customers(*), responsible:users_profiles!responsible_user_id(*)')
      .order('last_interaction_at', { ascending: false });
    if (!error && data) setConversations(data as WhatsAppConversation[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  async function fetchMessages(conversationId: string): Promise<WhatsAppMessage[]> {
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .select('*, sender:users_profiles!sender_user_id(*)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    return error ? [] : (data as WhatsAppMessage[]);
  }

  async function sendMessage(conversationId: string, content: string, senderUserId: string) {
    const { data } = await supabase.from('whatsapp_messages').insert({
      conversation_id: conversationId, sender_type: 'user',
      sender_user_id: senderUserId, message_type: 'text', content,
    }).select().single();
    await supabase.from('whatsapp_conversations').update({
      last_message: content, last_interaction_at: new Date().toISOString(),
      status: 'respondida', unread_count: 0,
    }).eq('id', conversationId);
    await fetch();
    return data;
  }

  async function updateConversation(id: string, updates: Partial<WhatsAppConversation>) {
    const { customer, responsible, ...rest } = updates;
    await supabase.from('whatsapp_conversations').update(rest).eq('id', id);
    await fetch();
  }

  return { conversations, loading, fetchMessages, sendMessage, updateConversation, refetch: fetch };
}
