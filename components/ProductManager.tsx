
import React, { useState } from 'react';
import { UserSettings, Product } from '../types';

interface ProductManagerProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

const ProductManager: React.FC<ProductManagerProps> = ({ settings, onSave }) => {
  const [newProduct, setNewProduct] = useState<Product>({ id: '', name: '', description: '', price: 0, vatRate: 21 });
  const [searchTerm, setSearchTerm] = useState('');

  const addProduct = () => {
    if (newProduct.name) {
        const productToAdd = { ...newProduct, id: Date.now().toString() };
        onSave({ 
            ...settings, 
            products: [...(settings.products || []), productToAdd] 
        });
        setNewProduct({ id: '', name: '', description: '', price: 0, vatRate: 21 });
    }
  };

  const removeProduct = (id: string) => {
      onSave({
          ...settings,
          products: (settings.products || []).filter(p => p.id !== id)
      });
  };

  const filteredProducts = (settings.products || []).filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Productcatalogus</h2>
        <p className="text-gray-600 mt-1">Beheer hier uw standaard producten, diensten en uurtarieven voor sneller factureren.</p>
      </div>
      
      {/* Add New Product Section */}
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mb-8">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">Nieuw Product Toevoegen</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4 items-end">
                <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-indigo-800 mb-1">Naam</label>
                    <input 
                        placeholder="Bijv. Uurtarief" 
                        className="w-full p-2 border rounded text-sm bg-white"
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    />
                </div>
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-indigo-800 mb-1">Omschrijving</label>
                    <input 
                        placeholder="Standaard omschrijving (optioneel)" 
                        className="w-full p-2 border rounded text-sm bg-white"
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-indigo-800 mb-1">Prijs (€)</label>
                    <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full p-2 border rounded text-sm bg-white"
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-indigo-800 mb-1">BTW</label>
                    <select 
                        className="w-full p-2 border rounded text-sm bg-white"
                        value={newProduct.vatRate}
                        onChange={e => setNewProduct({...newProduct, vatRate: parseInt(e.target.value)})}
                    >
                        <option value={21}>21%</option>
                        <option value={9}>9%</option>
                        <option value={0}>0%</option>
                    </select>
                </div>
                <div className="md:col-span-1">
                    <button onClick={addProduct} className="w-full bg-indigo-600 text-white rounded p-2 text-sm font-bold hover:bg-indigo-700 flex justify-center items-center h-[38px]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>
            </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                 <div className="flex font-bold text-xs text-gray-500 uppercase tracking-wider w-full">
                    <div className="w-1/4">Naam</div>
                    <div className="w-1/3">Omschrijving</div>
                    <div className="w-1/6 text-right">Prijs</div>
                    <div className="w-1/6 text-center">BTW</div>
                    <div className="w-1/12"></div>
                 </div>
            </div>
            {/* Search Bar within Table Header Area */}
            <div className="bg-gray-50 px-4 pb-3 border-b border-gray-200">
                 <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Zoek product of omschrijving..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <SearchIcon />
                    </div>
                </div>
            </div>

            <div className="divide-y divide-gray-100">
                {filteredProducts.length === 0 ? (
                    <p className="p-8 text-center text-gray-400 text-sm italic">
                         {searchTerm ? 'Geen producten gevonden met deze zoekterm.' : 'Nog geen producten in de lijst.'}
                    </p>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product.id} className="px-4 py-3 flex items-center hover:bg-gray-50 transition">
                            <div className="w-1/4 font-bold text-gray-800 text-sm">{product.name}</div>
                            <div className="w-1/3 text-gray-600 text-sm truncate pr-4">{product.description}</div>
                            <div className="w-1/6 text-right font-medium text-gray-800 text-sm">€ {product.price.toFixed(2)}</div>
                            <div className="w-1/6 text-center text-xs"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{product.vatRate}%</span></div>
                            <div className="w-1/12 text-right">
                                <button onClick={() => removeProduct(product.id)} className="text-red-400 hover:text-red-600 p-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
      </div>
    </div>
  );
};

export default ProductManager;
