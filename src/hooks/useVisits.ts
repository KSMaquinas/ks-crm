import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Visit } from '../types';

export function useVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *, 
        customer:customers(*), 
        responsible:users_profiles!responsible_user_id(*),
        photos:visit_photos(photo_url)
      `)
      .order('visit_date', { ascending: false });
    if (!error && data) {
      setVisits(data.map((v: Record<string, unknown>) => ({
        ...v,
        photos: (v.photos as { photo_url: string }[]).map(p => p.photo_url),
      })) as Visit[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  async function addVisit(input: Partial<Visit>) {
    const { customer, responsible, photos, ...rest } = input;
    const { data, error } = await supabase.from('visits').insert(rest).select().single();
    if (!error && data) {
      if (rest.customer_id) {
        await supabase.from('customer_history').insert({
          customer_id: rest.customer_id, type: 'visit',
          title: 'Visita registrada', description: rest.objective,
        });
      }
      await fetch();
    }
  }

  async function updateVisit(id: string, updates: Partial<Visit>) {
    const { customer, responsible, photos, ...rest } = updates;
    await supabase.from('visits').update(rest).eq('id', id);
    await fetch();
  }

  return { visits, loading, addVisit, updateVisit, refetch: fetch };
}
