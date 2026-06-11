import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Task } from '../types';

export function useTasks(responsibleId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from('tasks')
      .select('*, customer:customers(*), responsible:users_profiles!responsible_user_id(*)')
      .order('due_date', { ascending: true });
    if (responsibleId) q = q.eq('responsible_user_id', responsibleId);

    const { data, error } = await q;
    if (!error && data) setTasks(data as Task[]);
    setLoading(false);
  }, [responsibleId]);

  useEffect(() => { fetch(); }, [fetch]);

  async function addTask(input: Partial<Task>) {
    const { customer, responsible, ...rest } = input;
    const { data, error } = await supabase.from('tasks').insert(rest).select().single();
    if (!error && data) {
      // Log history on customer
      if (rest.customer_id) {
        await supabase.from('customer_history').insert({
          customer_id: rest.customer_id, type: 'task',
          title: 'Tarefa criada', description: rest.title,
        });
      }
      await fetch();
    }
    return data;
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    const { customer, responsible, ...rest } = updates;
    await supabase.from('tasks').update(rest).eq('id', id);
    await fetch();
  }

  return { tasks, loading, addTask, updateTask, refetch: fetch };
}
