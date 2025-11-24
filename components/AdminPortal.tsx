
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AdminPortalProps {
  onLogout: () => void;
  user: User;
}

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Blocked';
    plan: 'Basic' | 'Pro' | 'Enterprise';
    licenseKey?: string; 
    password?: string;
    requiresPasswordChange?: boolean;
}

interface SystemLog {
    id: number;
    time: string;
    type: string;
    message: string;
}

interface FeatureFlag {
    id: string;
    name: string;
    description: string;
    status: 'stable' | 'beta' | 'alpha';
    enabled: boolean;
}

interface License {
    id: string;
    key: string;
    clientName: string;
    plan: 'Basic' | 'Pro' | 'Enterprise';
    price: number;
    expires: string;
    status: 'Active' | 'Expired' | 'Revoked';
}

interface SystemMessage {
    id: number;
    text: string;
    date: string;
    active: boolean;
}

// Admin Icons
const DashboardIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const UsersIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const SystemIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ShieldIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const ServerIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;
const CashIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChatIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>;
const FlagIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-8a2 2 0 012-2h10a2 2 0 012 2v8m2-8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2zM9 4a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H9a2 2 0 01-2-2V4z" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const PlusIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const PencilIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const CheckIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const KeyIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>;
const EyeIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;

const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout, user }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'system' | 'monitoring' | 'finance' | 'comms' | 'features' | 'security'>('dashboard');

  // --- PERSISTENT STATE ---
  // Initialize state from localStorage with safe parsing
  const [users, setUsers] = useState<AdminUser[]>(() => {
      try {
        const saved = localStorage.getItem('factflow_admin_users');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
          console.error("Failed to parse users", e);
          return [];
      }
  });
  
  const [licenses, setLicenses] = useState<License[]>(() => {
      try {
        const saved = localStorage.getItem('factflow_licenses');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
          console.error("Failed to parse licenses", e);
          return [];
      }
  });

  const [messageHistory, setMessageHistory] = useState<SystemMessage[]>(() => {
      try {
        const saved = localStorage.getItem('factflow_message_history');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
          return [];
      }
  });

  const [logs, setLogs] = useState<SystemLog[]>([]);
  
  const [features, setFeatures] = useState<FeatureFlag[]>([
      { id: 'f1', name: 'AI Generator', description: 'Enable Gemini integration', status: 'stable', enabled: true },
      { id: 'f2', name: 'iDeal Payment', description: 'Mollie Integration', status: 'beta', enabled: false },
      { id: 'f3', name: 'Dark Mode', description: 'UI Theme Toggle', status: 'alpha', enabled: false },
  ]);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  
  // Default date to next year
  const getFutureDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  };

  // License creation state
  const [newLicense, setNewLicense] = useState<Partial<License>>({ clientName: '', plan: 'Basic', expires: getFutureDate(), price: 10 });

  // Add User State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', plan: 'Basic', licenseKey: '', password: '' });

  // Editing state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);
  
  // Visibility State
  const [visiblePasswordId, setVisiblePasswordId] = useState<number | null>(null);
  const [visibleLicenseId, setVisibleLicenseId] = useState<string | null>(null);

  // DELETE CONFIRMATION STATE
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, type: 'user'|'license'|null, id: string|number | null, title: string}>({isOpen: false, type: null, id: null, title: ''});

  // --- EFFECTS ---
  useEffect(() => {
      localStorage.setItem('factflow_admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
      localStorage.setItem('factflow_licenses', JSON.stringify(licenses));
  }, [licenses]);

  useEffect(() => {
      localStorage.setItem('factflow_message_history', JSON.stringify(messageHistory));
  }, [messageHistory]);

  // --- ACTIONS ---
  
  const toggleUserStatus = (id: number) => {
      setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u));
  };

  const confirmDelete = () => {
    if (confirmModal.type === 'user' && typeof confirmModal.id === 'number') {
        const userToDelete = users.find(u => u.id === confirmModal.id);

        // 1. Remove User
        const updatedUsers = users.filter(u => u.id !== confirmModal.id);
        setUsers(updatedUsers);

        // 2. Remove Linked License automatically
        if (userToDelete && userToDelete.licenseKey) {
             const updatedLicenses = licenses.filter(l => l.key !== userToDelete.licenseKey);
             setLicenses(updatedLicenses);
        }
    } else if (confirmModal.type === 'license' && typeof confirmModal.id === 'string') {
        const licenseToRemove = licenses.find(l => l.id === confirmModal.id);
        const updatedLicenses = licenses.filter(l => l.id !== confirmModal.id);
        setLicenses(updatedLicenses);

        // Also unlink the license from any user who has it
        if (licenseToRemove) {
            setUsers(prevUsers => prevUsers.map(u => 
                u.licenseKey === licenseToRemove.key 
                ? { ...u, licenseKey: undefined, plan: 'Basic' as const } 
                : u
            ));
        }
    }
    setConfirmModal({isOpen: false, type: null, id: null, title: ''});
  };

  const toggleFeature = (id: string) => {
      setFeatures(features.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const addLicense = () => {
      if(!newLicense.clientName || !newLicense.expires) {
          alert("Vul alstublieft een klantnaam en vervaldatum in.");
          return;
      }

      const key = Math.random().toString(36).substring(2, 15).toUpperCase();
      const licenseToAdd = {
          id: Date.now().toString(),
          key: `LIC-${key}`,
          clientName: newLicense.clientName,
          plan: newLicense.plan as any,
          price: Number(newLicense.price) || 0,
          expires: newLicense.expires,
          status: 'Active'
      };

      setLicenses([...licenses, licenseToAdd as License]);
      setNewLicense({ clientName: '', plan: 'Basic', expires: getFutureDate(), price: 10 });
  };

  const startEditingPrice = (l: License) => {
      setEditingPriceId(l.id);
      setEditPriceValue(l.price);
  }

  const savePrice = (id: string) => {
      setLicenses(licenses.map(l => l.id === id ? { ...l, price: editPriceValue } : l));
      setEditingPriceId(null);
  }

  const sendSystemMessage = () => {
      if(!systemMessage) return;
      
      // PERSISTENT STORAGE
      localStorage.setItem('factflow_system_message', systemMessage);
      
      const newHistoryItem: SystemMessage = {
          id: Date.now(),
          text: systemMessage,
          date: new Date().toLocaleString(),
          active: true
      };
      
      // Update history, set others to inactive if we only support 1 broadcast at a time
      setMessageHistory([newHistoryItem, ...messageHistory.map(m => ({...m, active: false}))]);

      const newLog = { id: Date.now(), time: new Date().toLocaleTimeString(), type: 'Comms', message: `Broadcast sent: ${systemMessage}` };
      setLogs([newLog, ...logs]);
      alert(`Bericht verzonden! Gebruikers zien dit nu bovenaan hun scherm.`);
      setSystemMessage('');
  }

  const clearBroadcast = () => {
      localStorage.removeItem('factflow_system_message');
      setMessageHistory(messageHistory.map(m => ({...m, active: false})));
      alert("Systeembericht verwijderd. Het is niet meer zichtbaar voor gebruikers.");
  }

  const generatePassword = () => {
      const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#";
      let pass = "";
      for(let i=0; i<8; i++) {
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setNewUser({...newUser, password: pass});
  }

  const syncLicensesWithUsers = () => {
      const updatedLicenses = licenses.map(l => {
          const userWithLicense = users.find(u => u.licenseKey === l.key);
          if (userWithLicense) {
              return { ...l, clientName: userWithLicense.name };
          }
          return l;
      });
      setLicenses(updatedLicenses);
      alert("Licenties zijn bijgewerkt aan de hand van gekoppelde gebruikers.");
  };

  const handleAddUser = () => {
      // 1. Validatie
      if (!newUser.name || !newUser.email || !newUser.password) {
          alert("Vul de naam, e-mailadres en wachtwoord in.");
          return;
      }

      // 2. Waardes vastleggen
      const nameToAdd = newUser.name;
      const emailToAdd = newUser.email;
      const passwordToAdd = newUser.password;
      let licenseKeyToAdd = newUser.licenseKey;
      let planToAdd = newUser.plan;

      // 3. Licentie logica
      if (licenseKeyToAdd) {
          // Geval A: Bestaande licentie geselecteerd
          const linkedLicense = licenses.find(l => l.key === licenseKeyToAdd);
          if (linkedLicense) {
              planToAdd = linkedLicense.plan as any;
               // Update de naam op de bestaande licentie
               setLicenses(prevLicenses => prevLicenses.map(l => 
                  l.key === licenseKeyToAdd ? { ...l, clientName: nameToAdd } : l
               ));
          }
      } else {
          // Geval B: Geen licentie geselecteerd -> Nieuwe aanmaken
          const generatedKey = `LIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
          licenseKeyToAdd = generatedKey;
          
          const defaultPrices: any = { 'Basic': 10, 'Pro': 25, 'Enterprise': 50 };
          const price = defaultPrices[planToAdd] || 10;

          const newLicenseEntry: License = {
              id: Date.now().toString(),
              key: generatedKey,
              clientName: nameToAdd,
              plan: planToAdd as any,
              price: price,
              expires: getFutureDate(),
              status: 'Active'
          };
          
          setLicenses(prev => [...prev, newLicenseEntry]);
      }

      // 4. Gebruiker toevoegen
      const newUserObj: AdminUser = {
          id: Date.now(),
          name: nameToAdd,
          email: emailToAdd,
          role: 'User',
          status: 'Active',
          plan: planToAdd as any,
          licenseKey: licenseKeyToAdd,
          password: passwordToAdd,
          requiresPasswordChange: true // Force password change on first login
      };
      
      setUsers(prev => [...prev, newUserObj]);

      // 5. Reset en sluit modal
      setNewUser({ name: '', email: '', plan: 'Basic', licenseKey: '', password: '' });
      setIsUserModalOpen(false);
  };

  // --- RENDER CONTENT ---

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">Dashboard Overzicht</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium uppercase">Actieve Gebruikers</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">{users.filter(u => u.status === 'Active').length}</div>
                <div className="text-green-500 text-xs font-medium mt-2">Realtime</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium uppercase">Actieve Licenties</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">{licenses.filter(l => l.status === 'Active').length}</div>
                <div className="text-slate-400 text-xs font-medium mt-2">Van totaal {licenses.length}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium uppercase">Totale Omzet</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">€ {licenses.reduce((acc, l) => acc + (l.price || 0), 0)}</div>
                <div className="text-slate-400 text-xs font-medium mt-2">Gebaseerd op licentieprijzen</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium uppercase">Systeem Status</div>
                <div className={`text-3xl font-bold mt-2 ${maintenanceMode ? 'text-orange-500' : 'text-green-600'}`}>
                    {maintenanceMode ? 'Onderhoud' : 'Online'}
                </div>
                <div className="text-slate-400 text-xs font-medium mt-2">Uptime 99.9%</div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6 animate-fade-in relative">
            {/* Modal for Adding User - FIXED POSITIONING */}
            {isUserModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl border border-slate-200 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Nieuwe Gebruiker</h3>
                            <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-600"><XIcon /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Naam</label>
                                <input 
                                    type="text" 
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Volledige naam"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">E-mailadres</label>
                                <input 
                                    type="email" 
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="naam@bedrijf.nl"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Wachtwoord</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Wachtwoord"
                                    />
                                    <button 
                                        onClick={generatePassword}
                                        className="mt-1 bg-slate-200 hover:bg-slate-300 px-3 rounded text-sm text-slate-700 font-medium"
                                    >
                                        Genereer
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Koppel Licentie (Optioneel)</label>
                                <select 
                                    value={newUser.licenseKey}
                                    onChange={(e) => setNewUser({...newUser, licenseKey: e.target.value})}
                                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Geen licentie koppelen</option>
                                    {licenses.filter(l => l.status === 'Active').map(l => (
                                        <option key={l.id} value={l.key}>
                                            {l.clientName} - {l.plan} ({l.key.substring(0,8)}...)
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-1">
                                    Selecteer een bestaande licentie om deze direct aan de gebruiker te koppelen. De naam van de licentie wordt automatisch bijgewerkt.
                                </p>
                            </div>
                            {!newUser.licenseKey && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Abonnement (Handmatig)</label>
                                    <select 
                                        value={newUser.plan}
                                        onChange={(e) => setNewUser({...newUser, plan: e.target.value})}
                                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Basic">Basic</option>
                                        <option value="Pro">Pro</option>
                                        <option value="Enterprise">Enterprise</option>
                                    </select>
                                </div>
                            )}
                            <div className="pt-2 flex justify-end space-x-2">
                                <button onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded text-sm font-medium">Annuleren</button>
                                <button onClick={handleAddUser} className="px-4 py-2 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700">Toevoegen</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Gebruikersbeheer</h2>
                <button 
                    onClick={() => setIsUserModalOpen(true)} 
                    className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700 font-medium flex items-center"
                >
                    <PlusIcon /> <span className="ml-2">Gebruiker Toevoegen</span>
                </button>
            </div>
            <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Naam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Abonnement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Wachtwoord</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actie</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {users.length === 0 ? (
                      <tr><td colSpan={6} className="p-4 text-center text-slate-400">Geen gebruikers gevonden.</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{u.name}</div>
                        <div className="text-sm text-slate-500">{u.email}</div>
                        {u.licenseKey && (
                            <div className="flex items-center text-xs text-indigo-600 mt-1">
                                <KeyIcon />
                                <span className="ml-1 font-mono">{u.licenseKey.substring(0, 10)}...</span>
                            </div>
                        )}
                        {u.requiresPasswordChange && (
                             <div className="mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Moet wachtwoord wijzigen
                                </span>
                             </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{u.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' : u.plan === 'Pro' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{u.plan}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{visiblePasswordId === u.id ? (u.password || 'n.v.t.') : '••••••'}</span>
                            <button 
                                onClick={() => setVisiblePasswordId(visiblePasswordId === u.id ? null : u.id)}
                                className="text-slate-400 hover:text-slate-600"
                                title={visiblePasswordId === u.id ? "Verberg" : "Toon"}
                            >
                                {visiblePasswordId === u.id ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center space-x-2">
                        <button onClick={() => toggleUserStatus(u.id)} className={`${u.status === 'Active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}>
                            {u.status === 'Active' ? 'Blokkeren' : 'Activeren'}
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setConfirmModal({isOpen: true, type: 'user', id: u.id, title: `Gebruiker ${u.name} verwijderen?`});
                            }}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors relative z-10"
                            title="Verwijderen"
                        >
                            <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

    case 'monitoring':
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Monitoring & Logs</h2>
                    <button onClick={() => setLogs([])} className="text-sm text-red-500 hover:text-red-700">Wis Logs</button>
                </div>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto shadow-inner">
                    <div className="mb-2 opacity-50 border-b border-slate-700 pb-2 flex justify-between">
                        <span>System Log Stream - Live</span>
                        <span className="animate-pulse">● Monitoring Active</span>
                    </div>
                    {logs.length === 0 && <div className="text-slate-600 italic">Waiting for events...</div>}
                    {logs.map((err, idx) => (
                        <div key={idx} className="mb-1 border-b border-slate-800/50 pb-1 last:border-0">
                            <span className="text-slate-500">[{err.time}]</span> <span className="text-blue-400">[{err.type}]</span> {err.message}
                        </div>
                    ))}
                    <div className="mb-1 animate-pulse text-slate-600">_</div>
                </div>
            </div>
        );
    
    case 'system':
        return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800">Systeeminstellingen</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <div>
                            <div className="font-medium text-slate-900">Onderhoudsmodus</div>
                            <div className="text-sm text-slate-500">Zet het systeem tijdelijk op slot voor gebruikers</div>
                        </div>
                        <div 
                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                            className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer ${maintenanceMode ? 'bg-orange-500' : 'bg-gray-200'}`}
                        >
                             <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out border border-gray-300 ${maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-slate-700">API Rate Limit (per min)</label>
                            <input type="number" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900" defaultValue="60" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Back-up Frequentie</label>
                            <select className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900">
                                <option>Dagelijks (03:00 AM)</option>
                                <option>Elk uur</option>
                                <option>Wekelijks</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );

    case 'finance':
        return (
            <div className="space-y-8 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Financieel Overzicht & Licentiebeheer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase">Geschatte Omzet (YTD)</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">€ {licenses.reduce((acc, l) => acc + (l.price || 0), 0)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase">Actieve Abonnementen</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{licenses.filter(l => l.status === 'Active').length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase">Gemiddelde orderwaarde</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                € {licenses.length > 0 ? (licenses.reduce((acc, l) => acc + (l.price || 0), 0) / licenses.length).toFixed(2) : '0.00'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-700">Licenties beheren</h3>
                        <div className="flex space-x-2">
                            <button 
                                onClick={syncLicensesWithUsers} 
                                className="text-sm flex items-center text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 transition"
                                title="Synchroniseer namen van gebruikers naar licenties"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                Sync Gebruikers
                            </button>
                        </div>
                    </div>
                    {/* Add License Form */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-wrap gap-4 items-end mb-6">
                            <div className="flex-grow min-w-[200px]">
                                <label className="block text-xs font-bold text-slate-600 mb-1">Klantnaam (of tijdelijk)</label>
                                <input 
                                value={newLicense.clientName}
                                onChange={e => setNewLicense({...newLicense, clientName: e.target.value})}
                                className="w-full p-2 border border-slate-300 rounded text-sm bg-white text-slate-900 placeholder-slate-400" 
                                placeholder="Bedrijfsnaam"
                            />
                            </div>
                            <div className="w-32">
                                <label className="block text-xs font-bold text-slate-600 mb-1">Plan</label>
                                <select 
                                value={newLicense.plan}
                                onChange={e => {
                                    const plan = e.target.value as any;
                                    const defaultPrices = { 'Basic': 10, 'Pro': 25, 'Enterprise': 50 };
                                    setNewLicense({...newLicense, plan, price: defaultPrices[plan as keyof typeof defaultPrices]});
                                }}
                                className="w-full p-2 border border-slate-300 rounded text-sm bg-white text-slate-900"
                                >
                                    <option value="Basic">Basic</option>
                                    <option value="Pro">Pro</option>
                                    <option value="Enterprise">Enterprise</option>
                                </select>
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-bold text-slate-600 mb-1">Prijs (€)</label>
                                <input 
                                type="number"
                                value={newLicense.price}
                                onChange={e => setNewLicense({...newLicense, price: Number(e.target.value)})}
                                className="w-full p-2 border border-slate-300 rounded text-sm bg-white text-slate-900 placeholder-slate-400"
                            />
                            </div>
                            <div className="w-40">
                                <label className="block text-xs font-bold text-slate-600 mb-1">Geldig Tot</label>
                                <input 
                                type="date" 
                                value={newLicense.expires}
                                onChange={e => setNewLicense({...newLicense, expires: e.target.value})}
                                className="w-full p-2 border border-slate-300 rounded text-sm bg-white text-slate-900"
                            />
                            </div>
                            <button 
                            onClick={addLicense}
                            className="bg-slate-800 text-white px-4 py-2 rounded text-sm font-bold hover:bg-slate-700 active:bg-slate-900 transition-colors"
                            >
                                + Genereer Key
                            </button>
                    </div>

                    {/* License List */}
                    <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Klant / Gebruiker</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Licentiesleutel</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prijs</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Geldig Tot</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {licenses.length === 0 ? (
                                        <tr><td colSpan={7} className="p-6 text-center text-slate-400 italic">Geen licenties aangemaakt. Start hierboven.</td></tr>
                                ) : (
                                    licenses.map(l => (
                                        <tr key={l.id}>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{l.clientName}</td>
                                            <td className="px-6 py-4 text-sm font-mono text-slate-600 bg-slate-50 rounded">
                                                <div className="flex items-center gap-2">
                                                    <span>{visibleLicenseId === l.id ? l.key : '••••-••••-••••'}</span>
                                                    <button 
                                                        onClick={() => setVisibleLicenseId(visibleLicenseId === l.id ? null : l.id)}
                                                        className="text-slate-400 hover:text-slate-600"
                                                        title={visibleLicenseId === l.id ? "Verberg" : "Toon"}
                                                    >
                                                        {visibleLicenseId === l.id ? <EyeOffIcon /> : <EyeIcon />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${l.plan === 'Pro' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>{l.plan}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {editingPriceId === l.id ? (
                                                    <div className="flex items-center space-x-1">
                                                        <input 
                                                            type="number" 
                                                            value={editPriceValue} 
                                                            onChange={(e) => setEditPriceValue(Number(e.target.value))}
                                                            className="w-20 p-1 border rounded text-sm bg-white text-slate-900"
                                                        />
                                                        <button onClick={() => savePrice(l.id)} className="text-green-600 hover:text-green-800"><CheckIcon /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2 group">
                                                        <span>€ {l.price}</span>
                                                        <button onClick={() => startEditingPrice(l)} className="text-gray-300 hover:text-blue-600 group-hover:opacity-100 opacity-0 transition-opacity">
                                                            <PencilIcon />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{l.expires}</td>
                                            <td className="px-6 py-4">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${l.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {l.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setConfirmModal({isOpen: true, type: 'license', id: l.id, title: `Licentie van ${l.clientName} verwijderen?`});
                                                    }}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors relative z-10"
                                                    title="Verwijderen"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

    case 'comms':
         return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800">Communicatie</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Nieuw Systeembericht</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Bericht</label>
                            <textarea 
                                value={systemMessage}
                                onChange={(e) => setSystemMessage(e.target.value)}
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 bg-white text-slate-900" 
                                rows={4} 
                                placeholder="Typ uw bericht voor alle gebruikers..." 
                            />
                            <p className="text-xs text-slate-500 mt-2">Dit bericht verschijnt als een banner bovenaan het scherm bij alle ingelogde gebruikers.</p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={clearBroadcast}
                                className="text-red-600 hover:text-red-800 px-4 py-2 text-sm font-medium"
                            >
                                Wis Huidig Bericht
                            </button>
                            <button 
                                onClick={sendSystemMessage}
                                disabled={!systemMessage}
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-medium disabled:opacity-50"
                            >
                                Verstuur & Opslaan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Message History */}
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Bericht Geschiedenis</h3>
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Datum</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Bericht</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {messageHistory.length === 0 ? (
                                    <tr><td colSpan={3} className="px-6 py-4 text-sm text-slate-500 text-center">Geen eerdere berichten.</td></tr>
                                ) : (
                                    messageHistory.map(msg => (
                                        <tr key={msg.id}>
                                            <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{msg.date}</td>
                                            <td className="px-6 py-4 text-sm text-slate-800">{msg.text}</td>
                                            <td className="px-6 py-4 text-sm">
                                                {msg.active ? (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Actief</span>
                                                ) : (
                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Gearchiveerd</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

    case 'features':
        return (
             <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800">Functiebeheer (Feature Flags)</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="space-y-6">
                         {features.map(f => (
                             <div key={f.id} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0">
                                <div>
                                    <div className="font-bold text-slate-800">{f.name}</div>
                                    <div className="text-sm text-slate-500">{f.description}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${f.status === 'stable' ? 'bg-green-100 text-green-600' : f.status === 'beta' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                                        {f.status}
                                    </span>
                                    <button 
                                        onClick={() => toggleFeature(f.id)}
                                        className={`text-xs font-bold px-3 py-1 rounded transition-colors ${f.enabled ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                    >
                                        {f.enabled ? 'AAN' : 'UIT'}
                                    </button>
                                </div>
                            </div>
                         ))}
                    </div>
                </div>
             </div>
        );

    case 'security':
        return (
             <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800">Veiligheid & Audit</h2>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-700 mb-4">Beveiligingsbeleid</h3>
                        <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-700">Forceer 2FA voor admins</span>
                                <input type="checkbox" defaultChecked className="h-4 w-4 accent-indigo-600" />
                             </div>
                             <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-700">Wachtwoord verloop (90 dagen)</span>
                                <input type="checkbox" className="h-4 w-4 accent-indigo-600" />
                             </div>
                        </div>
                    </div>
                 </div>
             </div>
        );

      default:
        return <div className="p-12 text-center text-slate-500">Selecteer een menu optie om de details te bekijken.</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      
      {/* DELETE CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full border border-slate-200">
                  <div className="flex items-center text-red-600 mb-4">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                          <TrashIcon />
                      </div>
                      <h3 className="text-lg font-bold">Bevestig Verwijdering</h3>
                  </div>
                  <p className="text-slate-600 mb-6">{confirmModal.title}</p>
                  <p className="text-xs text-red-500 bg-red-50 p-2 rounded mb-6">
                      Let op: Deze actie kan niet ongedaan worden gemaakt.
                  </p>
                  <div className="flex justify-end space-x-3">
                      <button 
                          onClick={() => setConfirmModal({...confirmModal, isOpen: false})}
                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 font-medium transition"
                      >
                          Annuleren
                      </button>
                      <button 
                          onClick={confirmDelete}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium shadow-md transition"
                      >
                          Definitief Verwijderen
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Admin Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">A</div>
            <div>
                <h1 className="text-lg font-bold text-white">FactFlow</h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Beheerportaal</p>
            </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-6 overflow-y-auto">
          {[
            { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
            { id: 'users', icon: <UsersIcon />, label: 'Gebruikers' },
            { id: 'system', icon: <SystemIcon />, label: 'Systeem' },
            { id: 'monitoring', icon: <ServerIcon />, label: 'Monitoring' },
            { id: 'finance', icon: <CashIcon />, label: 'Financieel' },
            { id: 'comms', icon: <ChatIcon />, label: 'Communicatie' },
            { id: 'features', icon: <FlagIcon />, label: 'Features' },
            { id: 'security', icon: <ShieldIcon />, label: 'Veiligheid' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium group ${
                activeTab === item.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <span className={`transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
            <div className="flex items-center mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-700">AD</div>
                <div className="ml-3">
                    <div className="text-sm font-medium text-white">Admin</div>
                    <div className="text-xs text-slate-500">Super User</div>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="w-full flex items-center px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors text-sm"
            >
                <LogoutIcon />
                <span className="ml-3">Afmelden</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
          <header className="bg-white shadow-sm border-b border-slate-200 py-4 px-8 flex justify-between items-center sticky top-0 z-40 backdrop-blur-sm bg-white/90">
              <h2 className="text-lg font-semibold text-slate-700 capitalize flex items-center">
                <span className="text-slate-400 mr-2 font-normal">Beheer /</span> {activeTab}
              </h2>
              <div className="flex items-center space-x-4">
                  <div className={`flex items-center text-xs px-3 py-1.5 rounded-full border shadow-sm ${maintenanceMode ? 'text-orange-700 bg-orange-50 border-orange-200' : 'text-green-700 bg-green-50 border-green-200'}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${maintenanceMode ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                      {maintenanceMode ? 'Maintenance Mode' : 'System Operational'}
                  </div>
              </div>
          </header>
          <main className="p-8">
              {renderContent()}
          </main>
      </div>
    </div>
  );
};

export default AdminPortal;
