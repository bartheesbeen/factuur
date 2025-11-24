
import React, { useState, useEffect } from 'react';
import { Invoice, UserSettings, User, LineItem, DocumentType, Product } from './types';
import Login from './components/Login';
import InvoicePreview from './components/InvoicePreview';
import Settings from './components/Settings';
import ProductManager from './components/ProductManager';
import CustomerManager from './components/CustomerManager';
import AdminPortal from './components/AdminPortal';
import { parseWorkDescriptionToItems } from './services/geminiService';

// Icons
const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const DocumentIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CogIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SparklesIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" /></svg>;
const FolderIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const ArrowRightIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const CashIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CubeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const PrinterIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>;
const MailIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const ChevronDownIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const ChevronRightIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const BellIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const PencilIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const UserGroupIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ExclamationCircleIcon = () => <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


// Default settings
const defaultSettings: UserSettings = {
  companyName: "JP Goes Verbouw",
  userName: "",
  kvkNumber: "83464573",
  vatNumber: "NL862884354B01",
  address: "De Brigantijn 20\n5247 LK Rosmalen",
  iban: "NL93 ABNA 0607 1893 98",
  logoUrl: null,
  watermarkUrl: null,
  brandWatermarkUrl: null,
  watermarkOpacity: 0.4,
  layoutStyle: 'modern',
  primaryColor: "#4F46E5",
  products: [],
  dashboardNotes: "",
  footerText: "",
  activePlan: 'Free',
  planStatus: 'trial'
};

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'invoices' | 'create' | 'settings' | 'products' | 'customers'>('home');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  
  // Navigation State
  const [viewMode, setViewMode] = useState<'folders' | 'list'>('folders');
  const [selectedFolderYear, setSelectedFolderYear] = useState<string | null>(null);
  const [isInvoiceMenuOpen, setIsInvoiceMenuOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Print State (Used to render a specific invoice for printing)
  const [printInvoiceData, setPrintInvoiceData] = useState<Invoice | null>(null);

  // Validation State
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);

  // Login Error & Password Change State
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null); // Temp hold user until pwd change
  const [newPassword, setNewPassword] = useState('');

  // System Broadcast Message
  const [systemBroadcast, setSystemBroadcast] = useState<string | null>(null);
  const [dismissedMessage, setDismissedMessage] = useState<string | null>(localStorage.getItem('factflow_read_message'));

  // Creation State
  const [newInvoice, setNewInvoice] = useState<Invoice>({
    id: '', 
    type: 'invoice',
    number: `F${new Date().getFullYear()}-001`, 
    date: new Date().toISOString().split('T')[0],
    dueDate: '', 
    clientName: '', 
    clientAddress: '', 
    project: '', 
    status: 'draft', 
    items: [], 
    total: 0, 
    discountAmount: 0,
    discountVatRate: 21
  });
  const [aiInput, setAiInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false); // Default closed

  // Check for system message on mount and when admin status changes
  useEffect(() => {
      const msg = localStorage.getItem('factflow_system_message');
      setSystemBroadcast(msg);
      
      const readMsg = localStorage.getItem('factflow_read_message');
      setDismissedMessage(readMsg);
  }, [isAdmin, user, activeTab]); 

  // Derived Data for Folders
  const uniqueYears = Array.from(new Set(invoices.map(i => i.date.split('-')[0]))).sort().reverse();
  
  // Stats Calculation
  const openInvoices = invoices.filter(i => i.status === 'sent' && i.type === 'invoice');
  const openAmount = openInvoices.reduce((acc, i) => acc + i.total, 0);
  const paidInvoices = invoices.filter(i => i.status === 'paid' && i.type === 'invoice');
  const paidAmount = paidInvoices.reduce((acc, i) => acc + i.total, 0);
  const draftAmount = invoices.filter(i => i.status === 'draft' && i.type === 'invoice').reduce((acc, i) => acc + i.total, 0);

  // Dashboard Specific Data
  const today = new Date().toISOString().split('T')[0];
  const overdueQuotes = invoices.filter(i => i.type === 'quote' && i.status === 'sent' && i.dueDate < today);
  // Sort open invoices by date (oldest first)
  const openInvoicesSorted = [...openInvoices].sort((a, b) => a.date.localeCompare(b.date));

  // Trigger print when printInvoiceData is set
  useEffect(() => {
    if (printInvoiceData) {
        // Small delay to ensure React has rendered the print view
        const timer = setTimeout(() => {
            window.print();
            // Clear after print dialog closes (or shortly after it opens)
            setPrintInvoiceData(null);
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [printInvoiceData]);

  // Filter Invoices based on folder selection AND Search
  const filteredInvoices = invoices.filter(inv => {
    // 1. Search Query Filter (Global)
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
            inv.number.toLowerCase().includes(query) ||
            inv.clientName.toLowerCase().includes(query) ||
            (inv.project && inv.project.toLowerCase().includes(query)) ||
            inv.date.includes(query)
        );
    }

    // 2. View Mode Filters (Only if no search)
    if (viewMode === 'list') return true;

    // Inside a Year Folder
    if (selectedFolderYear) {
        return inv.date.startsWith(selectedFolderYear);
    }
    return true; // Root folder view handles its own rendering (showing years, not invoices)
  });

  const completeLogin = (userObj: any) => {
      // 2. Set Basic User Info
    const displayName = userObj.name;
    setUser({ email: userObj.email, name: displayName });
    setIsAdmin(false);

    // 3. Configure Settings based on Account Status
    let newSettings = { ...settings, userName: displayName };

    if (userObj.licenseKey) {
        // If they have a linked license, apply those specific details
        const storedLicenses = JSON.parse(localStorage.getItem('factflow_licenses') || '[]');
        const linkedLicense = storedLicenses.find((l: any) => l.key === userObj.licenseKey);
        
        if (linkedLicense && linkedLicense.status === 'Active') {
            newSettings = {
                ...newSettings,
                activePlan: linkedLicense.plan,
                planStatus: 'active',
                planExpires: linkedLicense.expires,
                licenseKey: linkedLicense.key
            };
        }
    } else {
        // Fallback if they have a plan set in user table but no specific key linked
            newSettings = {
            ...newSettings,
            activePlan: userObj.plan,
            planStatus: 'active'
        };
    }
    
    setSettings(newSettings);
  };

  const handleLogin = (email: string, password?: string) => {
    // 1. Check if user exists in the "Admin Database" (localStorage)
    const adminUsers = JSON.parse(localStorage.getItem('factflow_admin_users') || '[]');
    const foundUser = adminUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
        // Enforce password if user exists in admin DB
        if (foundUser.password && foundUser.password !== password) {
            setLoginError("Onjuist wachtwoord. Probeer het opnieuw.");
            return;
        }

        if (foundUser.status === 'Blocked') {
            setLoginError("Dit account is geblokkeerd. Neem contact op met de beheerder.");
            return;
        }

        // CHECK IF PASSWORD CHANGE IS REQUIRED
        if (foundUser.requiresPasswordChange) {
            setTempUser(foundUser);
            setShowPasswordChangeModal(true);
            setLoginError(null);
            return;
        }
    }

    // Clear error if success
    setLoginError(null);

    // If user exists, complete login. If standard demo user, creates a basic session.
    completeLogin(foundUser || { name: email.split('@')[0], email: email, plan: 'Free' });
  };

  const handleNewPasswordSubmit = () => {
      if (!newPassword || newPassword.length < 5) {
          alert("Kies een wachtwoord van minimaal 5 tekens.");
          return;
      }

      // Update user in localStorage
      const adminUsers = JSON.parse(localStorage.getItem('factflow_admin_users') || '[]');
      const updatedUsers = adminUsers.map((u: any) => {
          if (u.id === tempUser.id) {
              return { ...u, password: newPassword, requiresPasswordChange: false };
          }
          return u;
      });

      localStorage.setItem('factflow_admin_users', JSON.stringify(updatedUsers));
      
      // Proceed to login
      completeLogin(tempUser);
      setShowPasswordChangeModal(false);
      setTempUser(null);
      setNewPassword('');
  };

  const handleAdminLogin = (u: string, p: string) => {
    // Hardcoded admin credentials for demo purposes
    if (u === 'admin' && p === 'admin123') {
        setLoginError(null);
        setUser({ email: 'admin@factflow.nl', name: 'Administrator' });
        setIsAdmin(true);
    } else {
        setLoginError("Ongeldige inloggegevens voor beheerportaal.");
    }
  }

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  const handleDismissBroadcast = () => {
      if (systemBroadcast) {
          localStorage.setItem('factflow_read_message', systemBroadcast);
          setDismissedMessage(systemBroadcast);
      }
  };

  const handleAiGenerate = async () => {
    if (!aiInput) return;
    setIsGenerating(true);
    try {
      const items = await parseWorkDescriptionToItems(aiInput);
      // Map to include vatRate default 21 if not present
      const mappedItems = items.map(item => ({
          ...item,
          vatRate: 21
      }));
      
      setNewInvoice(prev => {
          const updatedItems = [...prev.items, ...mappedItems];
          // Recalculate happens in save, but let's trigger update
          return { ...prev, items: updatedItems };
      });
      setAiInput('');
    } catch (e) {
      alert("AI kon de tekst niet verwerken. Probeer het opnieuw.");
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateInvoiceTotal = (inv: Invoice): number => {
      const subtotal = inv.items.reduce((acc, item) => acc + item.amount, 0);
      const discount = inv.discountAmount || 0;
      
      // Calculate VAT per item
      let totalVat = 0;
      inv.items.forEach(item => {
          totalVat += item.amount * (item.vatRate / 100);
      });

      // Subtract discount VAT
      if (discount > 0) {
          totalVat -= discount * ((inv.discountVatRate || 21) / 100);
      }

      return (subtotal - discount) + totalVat;
  };

  const validateInvoice = (inv: Invoice): string[] => {
    const errors = [];
    if (!inv.clientName) errors.push("Klantnaam is niet ingevuld.");
    if (!inv.clientAddress) errors.push("Klantadres is niet ingevuld.");
    if (inv.items.length === 0) errors.push("Er zijn geen factuurregels toegevoegd.");
    if (inv.items.some(i => Number(i.quantity) === 0 || Number(i.price) === 0)) errors.push("Er zijn factuurregels met aantal of prijs 0.");
    
    return errors;
  };

  const saveInvoice = (force: boolean = false) => {
    if (!force) {
        const errors = validateInvoice(newInvoice);
        if (errors.length > 0) {
            setValidationErrors(errors);
            setShowValidationModal(true);
            return;
        }
    }
    
    setShowValidationModal(false);
    setValidationErrors([]);

    const total = calculateInvoiceTotal(newInvoice);
    
    const finalInvoice = {
      ...newInvoice,
      id: newInvoice.id || Date.now().toString(),
      total: total
    };

    // Check if updating existing
    const exists = invoices.find(i => i.id === finalInvoice.id);
    if (exists) {
        setInvoices(invoices.map(i => i.id === finalInvoice.id ? finalInvoice : i));
    } else {
        setInvoices([finalInvoice, ...invoices]);
    }
    
    setActiveTab('invoices');
    // Determine view mode
    setViewMode('folders'); 
    setSelectedFolderYear(finalInvoice.date.split('-')[0]);
    resetNewInvoice();
  };

  const updateInvoiceStatus = (id: string, newStatus: Invoice['status']) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  const resetNewInvoice = (type: DocumentType = 'invoice') => {
    const prefix = type === 'invoice' ? 'F' : 'O';
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    setNewInvoice({ 
        id: '', 
        type,
        number: `${prefix}${today.getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`, 
        date: today.toISOString().split('T')[0],
        dueDate: nextMonth.toISOString().split('T')[0], 
        clientName: '', 
        clientAddress: '', 
        project: '', 
        status: 'draft', 
        items: [], 
        total: 0,
        discountAmount: 0,
        discountVatRate: 21
    });
  };

  const handleProductSelect = (productId: string) => {
      const product = settings.products?.find(p => p.id === productId);
      if (product) {
          setNewInvoice(prev => ({
              ...prev,
              items: [...prev.items, {
                  description: product.name + (product.description ? ` - ${product.description}` : ''),
                  quantity: 1,
                  price: product.price,
                  amount: product.price,
                  vatRate: product.vatRate
              }]
          }));
      }
  };

  // Email Handler
  const handleEmail = (invoice: Invoice) => {
    const subject = `${invoice.type === 'quote' ? 'Offerte' : 'Factuur'} ${invoice.number} - ${settings.companyName}`;
    const body = `Beste ${invoice.clientName},\n\nHierbij ontvangt u de ${invoice.type === 'quote' ? 'offerte' : 'factuur'} ${invoice.number} voor ${invoice.project || 'de werkzaamheden'}.\n\nMet vriendelijke groet,\n\n${settings.companyName}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Print handlers
  const handlePrintFromList = (invoice: Invoice) => {
      setPrintInvoiceData(invoice);
  };

  const handlePrintFromEditor = () => {
      // Recalculate totals before printing to ensure accuracy
      const total = calculateInvoiceTotal(newInvoice);
      setPrintInvoiceData({ ...newInvoice, total });
  };

  if (!user) {
    return (
        <>
            {/* Password Change Modal */}
            {showPasswordChangeModal && (
                <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
                     <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 border-t-4 border-indigo-600 animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Wachtwoord Wijzigen</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Omdat dit uw eerste keer inloggen is (of omdat de beheerder dit heeft ingesteld), moet u uw wachtwoord wijzigen.
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nieuw Wachtwoord</label>
                                <input 
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    placeholder="Minimaal 5 tekens"
                                />
                            </div>
                            <button 
                                onClick={handleNewPasswordSubmit}
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                            >
                                Wachtwoord Opslaan & Inloggen
                            </button>
                        </div>
                     </div>
                </div>
            )}

            {/* Login Error Modal */}
            {loginError && !showPasswordChangeModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fade-in border-l-4 border-red-500">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-red-50 p-3 rounded-full mb-4">
                                <ExclamationCircleIcon />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Inloggen Mislukt</h3>
                            <p className="text-gray-500 mb-6">{loginError}</p>
                            <button 
                                onClick={() => setLoginError(null)} 
                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition shadow-sm"
                            >
                                Probeer Opnieuw
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Login onLogin={handleLogin} onAdminLogin={handleAdminLogin} />
        </>
    );
  }

  // Admin Portal Render
  if (isAdmin) {
    return <AdminPortal onLogout={handleLogout} user={user} />;
  }
  
  const showBanner = systemBroadcast && systemBroadcast !== dismissedMessage;

  return (
    <div className="h-screen flex bg-gray-100 font-sans flex-col overflow-hidden">
      {/* System Broadcast Banner */}
      {showBanner && (
          <div className="bg-blue-600 text-white px-6 py-3 shadow-md z-[60] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center">
                  <BellIcon />
                  <span className="ml-3 font-medium">{systemBroadcast}</span>
              </div>
              <button onClick={handleDismissBroadcast} className="text-blue-200 hover:text-white flex items-center gap-1 text-sm font-bold bg-blue-700 px-3 py-1 rounded-full hover:bg-blue-800 transition">
                  <span className="hidden sm:inline">Gelezen</span>
                  <XIcon />
              </button>
          </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
      {/* Validation Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fade-in">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-50 p-3 rounded-full mb-4">
                        <ExclamationCircleIcon />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Let op!</h3>
                    <p className="text-gray-500 mb-6">De volgende gegevens ontbreken of zijn onvolledig:</p>
                    <ul className="text-left w-full bg-red-50 border border-red-100 rounded-lg p-4 mb-6 space-y-2">
                        {validationErrors.map((error, idx) => (
                            <li key={idx} className="flex items-start text-sm text-red-700">
                                <span className="mr-2">•</span> {error}
                            </li>
                        ))}
                    </ul>
                    <div className="flex space-x-3 w-full">
                        <button 
                            onClick={() => setShowValidationModal(false)} 
                            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                        >
                            Terug naar bewerken
                        </button>
                        <button 
                            onClick={() => saveInvoice(true)} 
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition shadow-sm"
                        >
                            Toch opslaan
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Hidden Print Container - Works for both List and Editor views */}
      {printInvoiceData && (
          <div className="hidden print:block fixed inset-0 z-[100] bg-white">
              <InvoicePreview invoice={printInvoiceData} settings={settings} />
          </div>
      )}

      {/* Sidebar - using Sticky instead of Fixed for better layout management */}
      <div className={`w-64 bg-indigo-900 text-white flex flex-col z-50 shadow-xl overflow-y-auto flex-shrink-0 h-full ${printInvoiceData ? 'print:hidden' : 'no-print'}`}>
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-2xl font-bold tracking-tight italic">FactFlow</h1>
          <p className="text-indigo-300 text-xs mt-2 uppercase tracking-wider">Licentiehouder</p>
          <p className="font-medium">{settings.userName || user.name}</p>
          {settings.activePlan && settings.activePlan !== 'Free' && (
             <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-700 rounded text-[10px] font-bold uppercase tracking-wide border border-indigo-500">{settings.activePlan} Plan</span>
          )}
        </div>
        
        {/* Quick Action Button */}
        <div className="px-4 mt-6">
             <button 
                onClick={() => { setActiveTab('create'); resetNewInvoice('invoice'); }}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center"
             >
                <PlusIcon />
                <span className="ml-2 text-sm">Nieuwe Offerte/Factuur</span>
             </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-indigo-700 shadow-lg' : 'hover:bg-indigo-800 text-indigo-100'}`}
          >
            <HomeIcon />
            <span className="ml-3 font-medium">Home</span>
          </button>
          
          {/* Collapsible Invoices Menu */}
          <div>
            <button 
                onClick={() => setIsInvoiceMenuOpen(!isInvoiceMenuOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${['invoices', 'create'].includes(activeTab) ? 'bg-indigo-800' : 'hover:bg-indigo-800 text-indigo-100'}`}
            >
                <div className="flex items-center">
                    <FolderIcon />
                    <span className="ml-3 font-medium">Facturen</span>
                </div>
                {isInvoiceMenuOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </button>
            
            {isInvoiceMenuOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l border-indigo-700 pl-2">
                    <button 
                        onClick={() => { setActiveTab('invoices'); setViewMode('folders'); setSelectedFolderYear(null); }}
                        className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${activeTab === 'invoices' ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-800'}`}
                    >
                        <span className="font-medium">Overzicht</span>
                    </button>
                </div>
            )}
          </div>

          <button 
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'customers' ? 'bg-indigo-700 shadow-lg' : 'hover:bg-indigo-800 text-indigo-100'}`}
          >
            <UserGroupIcon />
            <span className="ml-3 font-medium">Klanten</span>
          </button>

          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-indigo-700 shadow-lg' : 'hover:bg-indigo-800 text-indigo-100'}`}
          >
            <CubeIcon />
            <span className="ml-3 font-medium">Producten</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-indigo-700 shadow-lg' : 'hover:bg-indigo-800 text-indigo-100'}`}
          >
            <CogIcon />
            <span className="ml-3 font-medium">Instellingen</span>
          </button>
        </nav>

        <div className="p-4 border-t border-indigo-800 mt-auto bg-indigo-900 z-10">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors"
            >
                <LogoutIcon />
                <span className="ml-3 font-medium">Uitloggen</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-8 overflow-y-auto h-full ${printInvoiceData ? 'print:hidden' : ''} print:ml-0 print:p-0`}>
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
             <div className="space-y-8">
                {/* Welcome Header - Smaller */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl py-3 px-5 text-white shadow-lg flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold">Welkom terug, {settings.userName || user.name}</h2>
                        <p className="text-indigo-100 opacity-90 text-xs">Klaar voor een productieve dag?</p>
                    </div>
                </div>
                
                {/* Financial Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Nog te ontvangen</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">€ {openAmount.toFixed(2)}</p>
                            </div>
                            <div className="p-2 bg-red-50 rounded-full text-red-500">
                                <CashIcon />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">{openInvoices.length} facturen openstaand</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Omzet (Betaald)</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">€ {paidAmount.toFixed(2)}</p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-full text-green-500">
                                <CashIcon />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">{paidInvoices.length} facturen afgerond</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-gray-400">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Waarde Concepten</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">€ {draftAmount.toFixed(2)}</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                                <DocumentIcon />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Werk in voorbereiding</p>
                    </div>
                </div>

                {/* Detailed Dashboard Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Open Invoices List */}
                    <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center">
                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                Openstaande Facturen
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[300px]">
                            {openInvoicesSorted.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm italic">Geen openstaande facturen. Goed bezig!</div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {openInvoicesSorted.map(inv => (
                                        <div key={inv.id} className="px-6 py-3 hover:bg-gray-50 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">{inv.clientName}</p>
                                                <p className="text-xs text-gray-500">{inv.date} • {inv.number}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 text-sm">€ {inv.total.toFixed(2)}</p>
                                                <button 
                                                    onClick={() => {setNewInvoice(inv); setActiveTab('create');}}
                                                    className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
                                                >
                                                    Bekijken
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notifications & Notes Column */}
                    <div className="space-y-8">
                        
                        {/* Expired Quotes Notifications */}
                        {overdueQuotes.length > 0 && (
                            <div className="bg-orange-50 rounded-xl shadow border border-orange-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-orange-100 flex items-center text-orange-800">
                                    <BellIcon />
                                    <h3 className="font-bold ml-2">Verlopen Offertes</h3>
                                </div>
                                <div className="divide-y divide-orange-100/50">
                                    {overdueQuotes.map(quote => (
                                        <div key={quote.id} className="px-6 py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">{quote.clientName}</p>
                                                <p className="text-xs text-red-500">Verlopen op: {quote.dueDate}</p>
                                            </div>
                                            <button 
                                                onClick={() => {setNewInvoice(quote); setActiveTab('create');}}
                                                className="text-xs bg-white border border-orange-200 text-orange-700 px-3 py-1 rounded hover:bg-orange-100 transition"
                                            >
                                                Actie
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notepad */}
                        <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col h-full">
                             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800 flex items-center">
                                    <PencilIcon />
                                    <span className="ml-2">Mijn Notities</span>
                                </h3>
                                <span className="text-xs text-gray-400">Slaat automatisch op</span>
                            </div>
                            <div className="p-4 flex-grow">
                                <textarea 
                                    className="w-full h-40 p-3 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-yellow-50 resize-none"
                                    placeholder="Type hier je herinneringen, to-do's of notities..."
                                    value={settings.dashboardNotes || ''}
                                    onChange={(e) => setSettings({...settings, dashboardNotes: e.target.value})}
                                />
                            </div>
                        </div>

                    </div>
                </div>
             </div>
        )}

        {/* INVOICES (FOLDERS) TAB */}
        {activeTab === 'invoices' && (
          <div className="space-y-8">
            
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Facturen</h2>
                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-2">
                        <span className={`cursor-pointer hover:text-indigo-600 ${!selectedFolderYear && !searchQuery ? 'font-bold text-indigo-700' : ''}`} onClick={() => {setSelectedFolderYear(null); setViewMode('folders'); setSearchQuery('');}}>Jaaroverzicht</span>
                        {selectedFolderYear && !searchQuery && (
                            <>
                                <ArrowRightIcon />
                                <span className="font-bold text-indigo-700">{selectedFolderYear}</span>
                            </>
                        )}
                         {searchQuery && (
                            <>
                                <ArrowRightIcon />
                                <span className="font-bold text-indigo-700">Zoekresultaten</span>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Zoeken..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <SearchIcon />
                    </div>
                </div>
            </div>

            {/* Level 1: Years (Only if no search and no specific year selected) */}
            {viewMode === 'folders' && !selectedFolderYear && !searchQuery && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {uniqueYears.length === 0 ? (
                        <div className="col-span-3 text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                            Nog geen administratie. Start met een nieuwe factuur!
                        </div>
                    ) : (
                        uniqueYears.map(year => (
                            <div key={year} onClick={() => setSelectedFolderYear(year)} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 group">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600 group-hover:bg-yellow-200 transition">
                                        <FolderIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{year}</h3>
                                        <p className="text-sm text-gray-500">{invoices.filter(i => i.date.startsWith(year)).length} documenten</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Level 2 & 3: Invoices List (Shows if inside a folder OR search is active OR viewmode is list) */}
            {(viewMode === 'list' || selectedFolderYear || searchQuery) && (
                <div className="space-y-8">
                    {!searchQuery && selectedFolderYear && <h3 className="text-lg font-bold text-gray-700 mb-4">Facturen {selectedFolderYear}</h3>}
                    {searchQuery && <h3 className="text-lg font-bold text-gray-700 mb-4">Zoekresultaten voor "{searchQuery}"</h3>}
                    
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nummer</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Klant / Project</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Datum</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Bedrag</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acties</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInvoices.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Geen documenten gevonden.</td></tr>
                            ) : (
                                filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${inv.type === 'invoice' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                                {inv.type === 'invoice' ? 'FACTUUR' : 'OFFERTE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <select 
                                            value={inv.status} 
                                            onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as any)}
                                            className={`text-xs font-semibold rounded-full px-2 py-1 border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                                                inv.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                                inv.status === 'sent' ? 'bg-red-100 text-red-800' : 
                                                inv.status === 'accepted' ? 'bg-blue-100 text-blue-800' : 
                                                'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            <option value="draft">Concept</option>
                                            <option value="sent">Verzonden (Open)</option>
                                            <option value="paid">Betaald</option>
                                            <option value="accepted">Geaccepteerd</option>
                                        </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="font-medium text-gray-900">{inv.clientName}</div>
                                            {inv.project && <div className="text-xs text-indigo-600 mt-0.5">{inv.project}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">€ {inv.total.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => handlePrintFromList(inv)} className="text-gray-500 hover:text-indigo-600" title="Download PDF">
                                            <PrinterIcon />
                                        </button>
                                        <button onClick={() => handleEmail(inv)} className="text-gray-500 hover:text-indigo-600" title="Verstuur via Email">
                                            <MailIcon />
                                        </button>
                                        <button onClick={() => { setNewInvoice(inv); setActiveTab('create'); }} className="text-indigo-600 hover:text-indigo-900 font-bold ml-2">Bewerk</button>
                                        </td>
                                    </tr>
                                    ))
                            )}
                        </tbody>
                        </table>
                    </div>
                </div>
            )}
          </div>
        )}

        {/* Customers View */}
        {activeTab === 'customers' && (
            <CustomerManager 
                invoices={invoices} 
                onSelectInvoice={(inv) => { setNewInvoice(inv); setActiveTab('create'); }} 
            />
        )}

        {/* Products View */}
        {activeTab === 'products' && (
          <ProductManager settings={settings} onSave={setSettings} />
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <Settings settings={settings} onSave={setSettings} />
        )}

        {/* Create/Edit View */}
        {activeTab === 'create' && (
          <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Left Panel: Editor */}
            <div className="w-full lg:w-5/12 bg-white shadow-xl rounded-xl p-6 overflow-y-auto no-print border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Document Bewerken</h2>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button 
                        onClick={() => setNewInvoice({...newInvoice, type: 'quote'})}
                        className={`px-3 py-1 text-sm rounded-md transition ${newInvoice.type === 'quote' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-gray-500'}`}
                      >
                          Offerte
                      </button>
                      <button 
                        onClick={() => setNewInvoice({...newInvoice, type: 'invoice'})}
                        className={`px-3 py-1 text-sm rounded-md transition ${newInvoice.type === 'invoice' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-gray-500'}`}
                      >
                          Factuur
                      </button>
                  </div>
              </div>
              
              {/* AI Auto-fill (Collapsible) */}
              <div className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                <div 
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-indigo-50/50 transition"
                    onClick={() => setIsAiOpen(!isAiOpen)}
                >
                    <label className="block text-sm font-bold text-indigo-900 flex items-center cursor-pointer">
                      <SparklesIcon /> <span className="ml-2">AI Assistent</span>
                    </label>
                    <div className="text-indigo-400">
                        {isAiOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </div>
                </div>
                
                {isAiOpen && (
                    <div className="px-5 pb-5">
                        <p className="text-xs text-indigo-700 mb-3">Omschrijf het werk en de materialen. De AI maakt de regels voor je.</p>
                        <textarea
                            className="w-full p-3 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                            rows={3}
                            placeholder="Bijv: 'Badkamer renovatie week 1, 40 uur arbeid a 55 euro, tegellijm 12 zakken a 15 euro...'"
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                        />
                        <button 
                            onClick={handleAiGenerate}
                            disabled={isGenerating}
                            className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-indigo-700 transition disabled:opacity-50 shadow-sm"
                        >
                            {isGenerating ? 'Bezig met genereren...' : 'Genereer Regels'}
                        </button>
                    </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">{newInvoice.type === 'quote' ? 'Offertenummer' : 'Factuurnummer'}</label>
                        <input type="text" value={newInvoice.number} onChange={e => setNewInvoice({...newInvoice, number: e.target.value})} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border bg-white"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Datum</label>
                        <input 
                            type="date" 
                            value={newInvoice.date} 
                            onChange={e => {
                                const newDate = e.target.value;
                                setNewInvoice({...newInvoice, date: newDate});
                            }} 
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Vervaldatum</label>
                        <input 
                            type="date" 
                            value={newInvoice.dueDate} 
                            onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})} 
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border bg-white"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Map / Project Naam</label>
                    <input 
                        type="text" 
                        value={newInvoice.project} 
                        onChange={e => setNewInvoice({...newInvoice, project: e.target.value})} 
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border bg-white" 
                        placeholder="Bijv. Verbouwing Badkamer (Optioneel)"
                        list="project-history"
                    />
                    <datalist id="project-history">
                        {Array.from(new Set(invoices.map(i => i.project))).filter(Boolean).map(p => <option key={p} value={p} />)}
                    </datalist>
                </div>
                <div className="grid grid-cols-1 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Klant Naam</label>
                        <input type="text" value={newInvoice.clientName} onChange={e => setNewInvoice({...newInvoice, clientName: e.target.value})} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border bg-white"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Klant Adres</label>
                        <textarea value={newInvoice.clientAddress} onChange={e => setNewInvoice({...newInvoice, clientAddress: e.target.value})} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border bg-white" rows={2}/>
                    </div>
                </div>

                <div className="border-t pt-6 mt-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-gray-800">Factuurregels</h3>
                        
                        {/* Product Selector */}
                        {(settings.products || []).length > 0 && (
                            <select 
                                onChange={(e) => {
                                    if(e.target.value) handleProductSelect(e.target.value);
                                    e.target.value = '';
                                }}
                                className="text-xs border rounded p-1 bg-white border-indigo-200 text-indigo-800"
                            >
                                <option value="">+ Product Toevoegen</option>
                                {settings.products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="space-y-2">
                        {newInvoice.items.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-start bg-gray-50 p-2 rounded border border-gray-200 flex-wrap">
                                <div className="flex-grow min-w-[150px]">
                                    <label className="block text-[10px] text-gray-500">Omschrijving</label>
                                    <textarea value={item.description} onChange={e => {
                                        const newItems = [...newInvoice.items];
                                        newItems[idx].description = e.target.value;
                                        setNewInvoice({...newInvoice, items: newItems});
                                    }} className="w-full border rounded p-1 text-xs h-14 bg-white" />
                                </div>
                                <div className="w-14">
                                    <label className="block text-[10px] text-gray-500">Aantal</label>
                                    <input 
                                        type="number"
                                        value={item.quantity} 
                                        onChange={e => {
                                            const newItems = [...newInvoice.items];
                                            const val = e.target.value;
                                            newItems[idx].quantity = val;
                                            newItems[idx].amount = (Number(val) || 0) * (Number(newItems[idx].price) || 0);
                                            setNewInvoice({...newInvoice, items: newItems});
                                        }} 
                                        className="w-full border rounded p-1 text-xs bg-white" 
                                    />
                                </div>
                                <div className="w-16">
                                    <label className="block text-[10px] text-gray-500">Prijs</label>
                                    <input 
                                        type="number"
                                        value={item.price} 
                                        onChange={e => {
                                            const newItems = [...newInvoice.items];
                                            const val = e.target.value;
                                            newItems[idx].price = val;
                                            newItems[idx].amount = (Number(newItems[idx].quantity) || 0) * (Number(val) || 0);
                                            setNewInvoice({...newInvoice, items: newItems});
                                        }} 
                                        className="w-full border rounded p-1 text-xs bg-white" 
                                    />
                                </div>
                                <div className="w-16">
                                    <label className="block text-[10px] text-gray-500">BTW</label>
                                    <select 
                                        value={item.vatRate ?? 21} // default to 21 if undefined
                                        onChange={e => {
                                            const newItems = [...newInvoice.items];
                                            newItems[idx].vatRate = Number(e.target.value);
                                            setNewInvoice({...newInvoice, items: newItems});
                                        }}
                                        className="w-full border rounded p-1 text-xs bg-white"
                                    >
                                        <option value={21}>21%</option>
                                        <option value={9}>9%</option>
                                        <option value={0}>0%</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => setNewInvoice({...newInvoice, items: [...newInvoice.items, { description: '', quantity: 1, price: 0, amount: 0, vatRate: 21 }]})}
                        className="mt-3 text-sm text-indigo-600 font-bold hover:text-indigo-800 flex items-center"
                    >
                        <PlusIcon /> <span className="ml-1">Lege regel</span>
                    </button>
                </div>
                
                {/* Discount Section */}
                <div className="border-t pt-4 mt-4 bg-gray-50 p-3 rounded">
                    <h4 className="text-xs font-bold text-gray-700 mb-2">Korting (Optioneel)</h4>
                    <div className="flex gap-4">
                         <div>
                            <label className="block text-[10px] text-gray-500">Bedrag (excl BTW)</label>
                            <input 
                                type="number" 
                                value={newInvoice.discountAmount || ''} 
                                onChange={e => setNewInvoice({...newInvoice, discountAmount: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                                className="border rounded p-1 text-xs w-24 bg-white"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500">BTW over korting</label>
                             <select 
                                value={newInvoice.discountVatRate ?? 21} 
                                onChange={e => setNewInvoice({...newInvoice, discountVatRate: Number(e.target.value)})}
                                className="border rounded p-1 text-xs bg-white w-20"
                            >
                                <option value={21}>21%</option>
                                <option value={9}>9%</option>
                                <option value={0}>0%</option>
                            </select>
                        </div>
                    </div>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t flex justify-between items-center">
                  <button 
                    onClick={() => setActiveTab('invoices')}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                      Annuleren
                  </button>
                  <div className="flex space-x-3">
                      <button 
                        onClick={handlePrintFromEditor}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition shadow-sm flex items-center"
                      >
                          <PrinterIcon /> <span className="ml-2">PDF / Print</span>
                      </button>
                      <button 
                        onClick={() => saveInvoice(false)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-md"
                      >
                          Opslaan
                      </button>
                  </div>
              </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="w-full lg:w-7/12 bg-gray-100 p-4 lg:p-8 rounded-xl overflow-y-auto flex justify-center border border-gray-200 print:bg-white print:p-0 print:w-full print:border-none">
              <InvoicePreview invoice={newInvoice} settings={settings} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
