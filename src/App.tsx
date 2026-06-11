import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { LoginSupabase } from './pages/LoginSupabase';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { CustomerDetail } from './pages/CustomerDetail';
import { Funnel } from './pages/Funnel';
import { WhatsApp } from './pages/WhatsApp';
import { Tasks } from './pages/Tasks';
import { Schedule } from './pages/Schedule';
import { Visits } from './pages/Visits';
import { Quotes } from './pages/Quotes';
import { Campaigns } from './pages/Campaigns';
import { Reports } from './pages/Reports';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ks-green flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-ks-green font-black text-2xl">KS</span>
          </div>
          <div className="text-white/70 text-sm">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginSupabase />;
  }

  return (
    <AppProvider currentUser={profile}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Customers />} />
            <Route path="/clientes/:id" element={<CustomerDetail />} />
            <Route path="/funil" element={<Funnel />} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="/tarefas" element={<Tasks />} />
            <Route path="/agenda" element={<Schedule />} />
            <Route path="/visitas" element={<Visits />} />
            <Route path="/orcamentos" element={<Quotes />} />
            <Route path="/campanhas" element={<Campaigns />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/configuracoes" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
