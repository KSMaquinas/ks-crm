import React, { createContext, useContext } from 'react';
import type { UserProfile } from '../types';
import { useCustomers } from '../hooks/useCustomers';
import { useTasks } from '../hooks/useTasks';
import { useConversations } from '../hooks/useConversations';
import { useVisits } from '../hooks/useVisits';
import { useQuotes } from '../hooks/useQuotes';
import { useCampaigns } from '../hooks/useCampaigns';
import { useUsers } from '../hooks/useUsers';

interface AppContextType {
  currentUser: UserProfile | null;
  users: ReturnType<typeof useUsers>['users'];
  addUser: ReturnType<typeof useUsers>['addUser'];
  toggleActive: ReturnType<typeof useUsers>['toggleActive'];
  customers: ReturnType<typeof useCustomers>['customers'];
  tasks: ReturnType<typeof useTasks>['tasks'];
  conversations: ReturnType<typeof useConversations>['conversations'];
  visits: ReturnType<typeof useVisits>['visits'];
  quotes: ReturnType<typeof useQuotes>['quotes'];
  campaigns: ReturnType<typeof useCampaigns>['campaigns'];
  addCustomer: ReturnType<typeof useCustomers>['addCustomer'];
  updateCustomer: ReturnType<typeof useCustomers>['updateCustomer'];
  updateFunnelStage: ReturnType<typeof useCustomers>['updateFunnelStage'];
  addTask: ReturnType<typeof useTasks>['addTask'];
  updateTask: ReturnType<typeof useTasks>['updateTask'];
  addVisit: ReturnType<typeof useVisits>['addVisit'];
  updateVisit: ReturnType<typeof useVisits>['updateVisit'];
  addQuote: ReturnType<typeof useQuotes>['addQuote'];
  updateQuote: ReturnType<typeof useQuotes>['updateQuote'];
  fetchMessages: ReturnType<typeof useConversations>['fetchMessages'];
  sendMessage: ReturnType<typeof useConversations>['sendMessage'];
  updateConversation: ReturnType<typeof useConversations>['updateConversation'];
  loading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: React.ReactNode;
  currentUser: UserProfile | null;
}

export function AppProvider({ children, currentUser }: AppProviderProps) {
  const { users, addUser, toggleActive } = useUsers();
  const { customers, addCustomer, updateCustomer, updateFunnelStage } = useCustomers();
  const { tasks, addTask, updateTask } = useTasks();
  const { conversations, fetchMessages, sendMessage, updateConversation } = useConversations();
  const { visits, addVisit, updateVisit } = useVisits();
  const { quotes, addQuote, updateQuote } = useQuotes();
  const { campaigns } = useCampaigns();

  const loading = false;

  return (
    <AppContext.Provider value={{
      currentUser,
      users, addUser, toggleActive,
      customers, tasks, conversations, visits, quotes, campaigns,
      addCustomer, updateCustomer, updateFunnelStage,
      addTask, updateTask,
      addVisit, updateVisit,
      addQuote, updateQuote,
      fetchMessages, sendMessage, updateConversation,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
