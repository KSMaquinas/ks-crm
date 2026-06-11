import { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Preencha e-mail e senha.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email.includes('@') && password.length >= 4) {
        onLogin();
      } else {
        setError('E-mail ou senha inválidos.');
      }
    }, 800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ks-green to-ks-green-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-card shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-ks-green p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-ks-green font-black text-2xl">KS</span>
          </div>
          <h1 className="text-white font-bold text-xl">KS CRM</h1>
          <p className="text-white/70 text-sm mt-1">KS Máquinas Implementos e Irrigação</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">E-mail</label>
            <input
              type="email"
              className="input"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label">Senha</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-ks-danger-light text-ks-danger text-sm rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3 text-base disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Entrando...
              </span>
            ) : 'Entrar'}
          </button>

          <div className="text-center text-xs text-gray-400">
            💡 Demo: use qualquer e-mail válido e senha com 4+ caracteres
          </div>
        </form>

        <div className="px-6 pb-4 text-center text-xs text-gray-300">
          Cacoal — RO · Acesso restrito a usuários autorizados
        </div>
      </div>
    </div>
  );
}
