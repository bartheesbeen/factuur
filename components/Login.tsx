
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password?: string) => void;
  onAdminLogin: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      if (loginMode === 'admin') {
        onAdminLogin(email, password);
      } else {
        onLogin(email, password);
      }
    }
  };

  const handleForgotPassword = () => {
      alert("Neem contact op met de systeembeheerder om uw wachtwoord te resetten.\n\nE-mail: support@factflow.nl");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md z-10 border-t-4 transition-colors duration-300" 
           style={{ borderColor: loginMode === 'admin' ? '#1e293b' : '#4f46e5' }}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${loginMode === 'admin' ? 'text-slate-800' : 'text-indigo-600'}`}>
            {loginMode === 'admin' ? 'FactFlow Admin' : 'FactFlow'}
          </h1>
          <p className="text-gray-500 mt-2">
            {loginMode === 'admin' ? 'Beveiligde toegang voor beheerders' : 'Log in om uw administratie te beheren'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Emailadres / Gebruikersnaam</label>
            <input
              type={loginMode === 'admin' ? "text" : "email"}
              required
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white ${loginMode === 'admin' ? 'focus:ring-slate-500 focus:border-slate-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={loginMode === 'admin' ? 'admin' : 'naam@bedrijf.nl'}
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Wachtwoord</label>
                {loginMode === 'user' && (
                    <button type="button" onClick={handleForgotPassword} className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline">
                        Wachtwoord vergeten?
                    </button>
                )}
            </div>
            <input
              type="password"
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white ${loginMode === 'admin' ? 'focus:ring-slate-500 focus:border-slate-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={loginMode === 'admin' ? 'admin123' : '******'}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                loginMode === 'admin' 
                ? 'bg-slate-800 hover:bg-slate-900 focus:ring-slate-500' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            }`}
          >
            {loginMode === 'admin' ? 'Toegang Verlenen' : 'Inloggen'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button 
            onClick={() => {
                setLoginMode(loginMode === 'user' ? 'admin' : 'user');
                setEmail('');
                setPassword('');
            }}
            className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors underline decoration-gray-200 underline-offset-2"
          >
            {loginMode === 'user' ? 'Inloggen als beheerder' : 'Terug naar gebruikers login'}
          </button>
          
           {loginMode === 'admin' && (
            <p className="text-xs text-gray-300 mt-2">
                Hint: admin / admin123
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
