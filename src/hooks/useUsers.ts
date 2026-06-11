import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { UserProfile, UserRole } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    const { data, error } = await supabase.from('users_profiles').select('*').order('name');
    if (!error && data) setUsers(data as UserProfile[]);
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  async function addUser(input: {
    name: string; email: string; phone: string; position: string; role: UserRole; password: string;
  }): Promise<{ error: string | null }> {
    // Create auth user via signUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: { name: input.name } },
    });

    if (authError) return { error: authError.message };
    if (!authData.user) return { error: 'Erro ao criar usuário' };

    // Insert profile
    const { error: profileError } = await supabase.from('users_profiles').insert({
      auth_user_id: authData.user.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      position: input.position,
      role: input.role,
      is_active: true,
    });

    if (profileError) return { error: profileError.message };

    await fetchUsers();
    return { error: null };
  }

  async function toggleActive(id: string, is_active: boolean) {
    await supabase.from('users_profiles').update({ is_active }).eq('id', id);
    await fetchUsers();
  }

  return { users, loading, addUser, toggleActive };
}
