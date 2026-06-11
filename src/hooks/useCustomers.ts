import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Customer, FunnelStage } from '../types';

export function useCustomers(responsibleId?: string) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from('customers')
      .select(`
        *,
        responsible:users_profiles!responsible_user_id(*),
        interests:customer_interests(interest_type)
      `)
      .order('created_at', { ascending: false });

    if (responsibleId) q = q.eq('responsible_user_id', responsibleId);

    const { data, error } = await q;
    if (!error && data) {
      setCustomers(data.map((c: Record<string, unknown>) => ({
        ...c,
        interests: (c.interests as { interest_type: string }[]).map(i => i.interest_type),
      })) as Customer[]);
    }
    setLoading(false);
  }, [responsibleId]);

  useEffect(() => { fetch(); }, [fetch]);

  async function addCustomer(input: Partial<Customer>): Promise<{ data: Customer | null; error: string | null }> {
    const { interests, responsible, ...rest } = input;
    const { data, error } = await supabase.from('customers').insert(rest).select().single();
    if (error || !data) return { data: null, error: error?.message || 'Erro ao salvar cliente' };
    if (interests?.length) {
      await supabase.from('customer_interests').insert(
        interests.map(i => ({ customer_id: data.id, interest_type: i }))
      );
    }
    await fetch();
    return { data: data as Customer, error: null };
  }

  async function updateCustomer(id: string, updates: Partial<Customer>) {
    const { interests, responsible, ...rest } = updates;
    await supabase.from('customers').update(rest).eq('id', id);
    if (interests !== undefined) {
      await supabase.from('customer_interests').delete().eq('customer_id', id);
      if (interests.length) {
        await supabase.from('customer_interests').insert(
          interests.map(i => ({ customer_id: id, interest_type: i }))
        );
      }
    }
    await fetch();
    // Record history
    await supabase.from('customer_history').insert({
      customer_id: id, type: 'note',
      title: 'Cliente atualizado',
      description: Object.keys(rest).join(', ') + ' alterado(s)',
    });
  }

  async function updateFunnelStage(id: string, stage: FunnelStage, previousStage: FunnelStage) {
    await supabase.from('customers').update({ funnel_stage: stage }).eq('id', id);
    await supabase.from('customer_history').insert({
      customer_id: id, type: 'stage_change',
      title: 'Etapa alterada',
      description: `${previousStage} → ${stage}`,
    });
    await fetch();
  }

  return { customers, loading, addCustomer, updateCustomer, updateFunnelStage, refetch: fetch };
}
