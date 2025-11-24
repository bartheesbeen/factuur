
import React, { useState } from 'react';
import { Invoice } from '../types';

interface CustomerManagerProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
}

const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

const CustomerManager: React.FC<CustomerManagerProps> = ({ invoices, onSelectInvoice }) => {
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique clients from invoice history
  const clients = (Array.from(new Set(invoices.map(i => i.clientName))) as string[])
    .filter(name => name && name.trim() !== '')
    .map(name => {
      const clientInvoices = invoices.filter(i => i.clientName === name);
      const lastInvoice = clientInvoices.sort((a, b) => b.date.localeCompare(a.date))[0];
      const totalSpent = clientInvoices.reduce((acc, i) => acc + i.total, 0);
      
      return {
        name,
        address: lastInvoice.clientAddress,
        invoiceCount: clientInvoices.length,
        totalSpent,
        lastSeen: lastInvoice.date,
        invoices: clientInvoices
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
        {/* List of Customers */}
        <div className={`w-full ${selectedClientName ? 'hidden md:block md:w-1/3' : ''} bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col`}>
            <div className="p-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Mijn Klanten</h2>
                <p className="text-sm text-gray-500 mt-1 mb-4">{clients.length} klanten gevonden in geschiedenis</p>
                
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Zoek klant of adres..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <SearchIcon />
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {filteredClients.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 italic">
                        {searchTerm ? 'Geen klanten gevonden met deze zoekterm.' : 'Nog geen klanten gevonden. Maak eerst facturen aan.'}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredClients.map(client => (
                            <div 
                                key={client.name}
                                onClick={() => setSelectedClientName(client.name)}
                                className={`p-4 hover:bg-indigo-50 cursor-pointer transition ${selectedClientName === client.name ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
                            >
                                <h3 className="font-bold text-gray-800">{client.name}</h3>
                                <p className="text-xs text-gray-500 truncate">{client.address.split('\n')[0]}</p>
                                <div className="flex justify-between mt-2 text-xs text-gray-400">
                                    <span>{client.invoiceCount} {client.invoiceCount === 1 ? 'document' : 'documenten'}</span>
                                    <span>Laatst: {client.lastSeen}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Customer Details */}
        {selectedClientName ? (
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
                 {(() => {
                    const client = clients.find(c => c.name === selectedClientName);
                    if (!client) return null;
                    
                    return (
                        <>
                            <div className="p-6 border-b border-gray-200 bg-indigo-600 text-white">
                                <button onClick={() => setSelectedClientName(null)} className="md:hidden text-sm text-indigo-200 mb-2">&larr; Terug</button>
                                <h2 className="text-2xl font-bold">{client.name}</h2>
                                <p className="opacity-80 whitespace-pre-line mt-2 text-sm">{client.address}</p>
                                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-white/10 p-3 rounded">
                                        <span className="block opacity-60 text-xs uppercase">Totaal Omzet</span>
                                        <span className="font-bold text-lg">€ {client.totalSpent.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded">
                                        <span className="block opacity-60 text-xs uppercase">Aantal Facturen</span>
                                        <span className="font-bold text-lg">{client.invoiceCount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <h3 className="font-bold text-gray-700 mb-4">Geschiedenis</h3>
                                <div className="space-y-3">
                                    {client.invoices.sort((a, b) => b.date.localeCompare(a.date)).map(inv => (
                                        <div 
                                            key={inv.id} 
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-white flex justify-between items-center"
                                        >
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${inv.type === 'invoice' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {inv.type === 'invoice' ? 'FACTUUR' : 'OFFERTE'}
                                                    </span>
                                                    <span className="font-semibold text-gray-800">{inv.number}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{inv.date} • {inv.project || 'Losse Factuur'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-800">€ {inv.total.toFixed(2)}</p>
                                                <button 
                                                    onClick={() => onSelectInvoice(inv)}
                                                    className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 mt-1"
                                                >
                                                    Bekijken
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    );
                 })()}
            </div>
        ) : (
            <div className="hidden md:flex flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 items-center justify-center text-gray-400">
                Selecteer een klant om details te zien
            </div>
        )}
    </div>
  );
};

export default CustomerManager;
