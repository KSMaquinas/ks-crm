import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Quote } from '../types';

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quotes')
      .select('*, customer:customers(*), responsible:users_profiles!responsible_user_id(*)')
      .order('created_at', { ascending: false });
    if (!error && data) setQuotes(data as Quote[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  async function addQuote(input: Partial<Quote>) {
    const { customer, responsible, ...rest } = input;
    const { data, error } = await supabase.from('quotes').insert(rest).select().single();
    if (!error && data) {
      if (rest.customer_id) {
        await supabase.from('customer_history').insert({
          customer_id: rest.customer_id, type: 'quote',
          title: 'Orçamento criado', description: `${rest.product} — R$ ${rest.value}`,
        });
      }
      await fetch();
    }
  }

  async function updateQuote(id: string, updates: Partial<Quote>) {
    const { customer, responsible, ...rest } = updates;
    await supabase.from('quotes').update(rest).eq('id', id);
    await fetch();
  }

  return { quotes, loading, addQuote, updateQuote, refetch: fetch };
}
