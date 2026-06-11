import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Campaign } from '../types';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('campaigns').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!error && data) setCampaigns(data as Campaign[]);
      setLoading(false);
    });
  }, []);

  return { campaigns, loading };
}
