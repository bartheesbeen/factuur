
export interface LineItem {
  description: string;
  quantity: number | string;
  price: number | string;
  amount: number;
  vatRate: number; // Added per-item VAT
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  vatRate: number;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  email?: string;
  phone?: string;
}

export type DocumentType = 'invoice' | 'quote';

export interface Invoice {
  id: string;
  type: DocumentType;
  number: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientAddress: string;
  project: string; 
  status: 'draft' | 'sent' | 'paid' | 'accepted';
  items: LineItem[];
  total: number;
  discountAmount: number; // New: Discount excluding VAT
  discountVatRate: number; // New: VAT rate applicable to the discount
}

export interface UserSettings {
  companyName: string;
  userName: string; // New: Custom display name
  kvkNumber: string;
  vatNumber: string;
  address: string;
  iban: string;
  logoUrl: string | null;
  watermarkUrl: string | null; 
  brandWatermarkUrl: string | null; 
  watermarkOpacity: number; 
  layoutStyle: 'modern' | 'classic'; 
  primaryColor: string;
  footerText?: string; // New: Custom footer text
  products: Product[]; // New: Saved products list
  customers?: Customer[]; // Optional: Manually saved customers
  dashboardNotes: string; // New: Saved notes
  
  // License & Plan
  licenseKey?: string;
  activePlan?: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  planStatus?: 'active' | 'expired' | 'trial';
  planExpires?: string;
}

export interface User {
  email: string;
  name: string;
}