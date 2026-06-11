import { Settings as SettingsIcon, Database, Bell, Smartphone, Link } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-ks-gray-dark">Configurações</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-ks-green-light rounded-lg"><Database size={18} className="text-ks-green" /></div>
            <div>
              <h3 className="font-semibold text-ks-gray-dark">Supabase</h3>
              <p className="text-xs text-gray-500">Banco de dados e autenticação</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status da conexão</span>
              <span className="badge-green">Conectado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Projeto</span>
              <span className="text-gray-500 font-mono text-xs">ks-crm-prod</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-ks-orange-light rounded-lg"><Smartphone size={18} className="text-ks-orange" /></div>
            <div>
              <h3 className="font-semibold text-ks-gray-dark">WhatsApp Business</h3>
              <p className="text-xs text-gray-500">Meta Cloud API</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className="badge-orange">Aguardando configuração</span>
            </div>
            <button className="btn-primary text-xs w-full justify-center">
              <Link size={12} /> Configurar Integração
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg"><Link size={18} className="text-blue-600" /></div>
            <div>
              <h3 className="font-semibold text-ks-gray-dark">Google Calendar</h3>
              <p className="text-xs text-gray-500">Sincronização de agenda</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className="badge-orange">Não configurado</span>
            </div>
            <button className="btn-ghost text-xs w-full justify-center">
              <Link size={12} /> Conectar Google
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-ks-green-light rounded-lg"><Bell size={18} className="text-ks-green" /></div>
            <div>
              <h3 className="font-semibold text-ks-gray-dark">Notificações</h3>
              <p className="text-xs text-gray-500">Alertas e lembretes</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            {[
              'Tarefas atrasadas', 'Retornos vencidos', 'Nova mensagem WhatsApp', 'Orçamento aprovado',
            ].map(label => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-600">{label}</span>
                <div className="w-10 h-5 bg-ks-green rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card bg-ks-green-light border border-ks-green/20">
        <div className="flex items-start gap-3">
          <SettingsIcon size={18} className="text-ks-green mt-0.5" />
          <div>
            <div className="font-semibold text-ks-green text-sm">KS CRM — v1.0</div>
            <p className="text-xs text-gray-600 mt-1">
              Sistema CRM desenvolvido exclusivamente para a KS Máquinas Implementos e Irrigação.
              Cacoal — RO. Powered by Supabase + Lovable Cloud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
