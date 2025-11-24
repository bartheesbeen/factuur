
import React from 'react';
import { Invoice, UserSettings } from '../types';

interface InvoicePreviewProps {
  invoice: Invoice;
  settings: UserSettings;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, settings }) => {
  const isQuote = invoice.type === 'quote';
  const title = isQuote ? 'OFFERTE' : 'FACTUUR';
  const primaryColor = settings.primaryColor || '#4F46E5'; // Default indigo

  // Calculate totals
  const subtotal = invoice.items.reduce((acc, item) => acc + item.amount, 0);
  const discountAmount = invoice.discountAmount || 0;
  const subtotalAfterDiscount = subtotal - discountAmount;

  // Calculate VAT Breakdown
  const vatBreakdown: { [key: number]: number } = {};
  
  // Add VAT from items
  invoice.items.forEach(item => {
    const vat = item.amount * (item.vatRate / 100);
    vatBreakdown[item.vatRate] = (vatBreakdown[item.vatRate] || 0) + vat;
  });

  // Subtract VAT from discount
  if (discountAmount > 0) {
    const discountVat = discountAmount * ((invoice.discountVatRate || 21) / 100);
    const rate = invoice.discountVatRate || 21;
    vatBreakdown[rate] = (vatBreakdown[rate] || 0) - discountVat;
  }

  const totalVat = Object.values(vatBreakdown).reduce((a, b) => a + b, 0);
  const total = subtotalAfterDiscount + totalVat;

  // Footer Text Logic
  const footerText = settings.footerText ? (
      <p className="whitespace-pre-line">{settings.footerText}</p>
  ) : (
      <>
        <p>Gelieve het bedrag over te maken binnen 14 dagen op rekening <span className="font-semibold">{settings.iban}</span> t.n.v. {settings.companyName}.</p>
        <p className="mt-1">Onder vermelding van nummer {invoice.number}.</p>
      </>
  );

  // Classic Excel-style Layout
  if (settings.layoutStyle === 'classic') {
    return (
      <div className="w-full max-w-[210mm] mx-auto bg-white shadow-lg min-h-[297mm] relative overflow-hidden print:shadow-none print:w-full print:max-w-none font-sans text-sm text-gray-900">
        {settings.watermarkUrl && (
          <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
              <img src={settings.watermarkUrl} alt="Background" className="w-full h-full object-cover"/>
          </div>
        )}

        {settings.brandWatermarkUrl && (
             <div className="absolute top-[350px] left-0 right-0 bottom-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <img src={settings.brandWatermarkUrl} alt="Watermark" className="w-[200%] max-w-none object-contain" style={{ opacity: settings.watermarkOpacity, mixBlendMode: 'normal' }}/>
             </div>
        )}

        <div className="relative z-10 p-8 h-full flex flex-col">
           <div className="h-32 flex justify-center items-center mb-4">
              {(settings.logoUrl || !settings.watermarkUrl) && (
                 <div className="text-center w-full flex justify-center">
                    {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt="Logo" className="h-24 mx-auto mb-2 object-contain" />
                    ) : (
                        <h1 className="text-3xl font-black uppercase tracking-widest italic text-center">{settings.companyName}</h1>
                    )}
                 </div>
              )}
           </div>

           <div className="flex justify-between items-start mb-8 px-2">
              <div className="bg-white/80 p-2 rounded border border-transparent">
                  <p className="font-bold text-lg">{invoice.clientName}</p>
                  <p className="whitespace-pre-line">{invoice.clientAddress}</p>
              </div>
              <div className="border-2 p-2 min-w-[200px] bg-white/90" style={{ borderColor: primaryColor }}>
                  <div className="flex justify-between mb-1">
                      <span className="font-bold">Datum:</span>
                      <span>{invoice.date}</span>
                  </div>
                   <div className="flex justify-between">
                      <span className="font-bold">{isQuote ? 'Offertenr:' : 'Factuurnr:'}</span>
                      <span>{invoice.number}</span>
                  </div>
              </div>
           </div>

           <div className="mb-1 border-b-2 border-black pb-1">
              <span className="font-bold text-lg uppercase">{title}: {invoice.project}</span>
           </div>

           <div className="flex-grow bg-white/60 relative">
              <table className="w-full border-collapse border-2 border-black relative z-10">
                  <thead>
                      <tr className="bg-transparent">
                          <th className="border border-black px-2 py-1 text-center font-bold w-3/5">Omschrijving</th>
                          <th className="border border-black px-2 py-1 text-center font-bold w-1/5">BTW</th>
                          <th className="border border-black px-2 py-1 text-center font-bold w-1/5">Bedrag (excl.)</th>
                      </tr>
                  </thead>
                  <tbody>
                      {invoice.items.map((item, idx) => (
                          <tr key={idx}>
                              <td className="border-l border-r border-black px-2 py-1 align-top">
                                  <div className="font-semibold">{item.description}</div>
                                  <div className="text-xs text-gray-600 pl-2">
                                      {item.quantity} x € {Number(item.price).toFixed(2)}
                                  </div>
                              </td>
                              <td className="border-l border-r border-black px-2 py-1 text-center align-top">
                                  {item.vatRate}%
                              </td>
                              <td className="border-l border-r border-black px-2 py-1 text-right align-top">
                                  € {item.amount.toFixed(2)}
                              </td>
                          </tr>
                      ))}
                      {Array.from({ length: Math.max(0, 12 - invoice.items.length) }).map((_, i) => (
                          <tr key={`empty-${i}`}>
                              <td className="border-l border-r border-black px-2 py-4">&nbsp;</td>
                              <td className="border-l border-r border-black px-2 py-4">&nbsp;</td>
                              <td className="border-l border-r border-black px-2 py-4">&nbsp;</td>
                          </tr>
                      ))}
                  </tbody>
                  <tfoot>
                      <tr className="border-t-2 border-black">
                          <td colSpan={2} className="border-r border-black px-2 py-1 text-right font-bold">Totaal excl. BTW</td>
                          <td className="px-2 py-1 text-right font-bold">€ {subtotal.toFixed(2)}</td>
                      </tr>
                      {discountAmount > 0 && (
                          <tr>
                              <td colSpan={2} className="border-r border-black px-2 py-1 text-right text-red-600">Korting</td>
                              <td className="px-2 py-1 text-right text-red-600">- € {discountAmount.toFixed(2)}</td>
                          </tr>
                      )}
                      {Object.entries(vatBreakdown).map(([rate, amount]) => (
                          amount !== 0 && (
                              <tr key={rate}>
                                  <td colSpan={2} className="border-r border-black px-2 py-1 text-right">BTW {rate}%</td>
                                  <td className="px-2 py-1 text-right">€ {amount.toFixed(2)}</td>
                              </tr>
                          )
                      ))}
                      <tr className="border-t-2 border-black bg-gray-100">
                          <td colSpan={2} className="border-r border-black px-2 py-2 text-right font-black text-lg">Totaal incl. BTW</td>
                          <td className="px-2 py-2 text-right font-black text-lg">€ {total.toFixed(2)}</td>
                      </tr>
                  </tfoot>
              </table>

              <div className="mt-4 border-2 p-2 text-center font-bold text-xs bg-white/90 relative z-10" style={{ borderColor: primaryColor }}>
                  <span className="font-normal text-black">{settings.footerText || 'Eventueel meerwerk wordt apart berekend. Betalingstermijn: 14 dagen.'}</span>
              </div>
           </div>

           <div className="mt-auto pt-8 text-center text-xs font-bold bg-white/80 p-2 relative z-10">
               <div className="border-t-2 border-gray-300 pt-2">
                   {settings.companyName} | {settings.iban}
               </div>
           </div>
        </div>
      </div>
    );
  }

  // Modern Web Layout
  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white shadow-lg min-h-[297mm] relative overflow-hidden print:shadow-none print:w-full print:max-w-none">
      {settings.watermarkUrl && (
        <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
            <img src={settings.watermarkUrl} alt="Background" className="w-full h-full object-cover"/>
        </div>
      )}

       {settings.brandWatermarkUrl && (
             <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <img src={settings.brandWatermarkUrl} alt="Watermark" className="w-[120%] max-w-none transform -rotate-12" style={{ opacity: settings.watermarkOpacity }}/>
             </div>
        )}

      <div className="relative z-10 p-12 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start mb-12">
          <div>
            {settings.logoUrl ? (
               <img src={settings.logoUrl} alt="Logo" className="h-16 object-contain mb-4" />
            ) : (
              <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>{settings.companyName}</h1>
            )}
            <div className="text-sm text-gray-600">
              <p className="whitespace-pre-line">{settings.address}</p>
              <p>KvK: {settings.kvkNumber}</p>
              <p>BTW: {settings.vatNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold uppercase tracking-wide opacity-40" style={{ color: primaryColor }}>{title}</h2>
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p><span className="font-semibold w-24 inline-block">Nummer:</span> {invoice.number}</p>
              <p><span className="font-semibold w-24 inline-block">Datum:</span> {invoice.date}</p>
              <p><span className="font-semibold w-24 inline-block">Vervaldatum:</span> {invoice.dueDate}</p>
              <p><span className="font-semibold w-24 inline-block">Project:</span> {invoice.project}</p>
            </div>
          </div>
        </div>

        <div className="mb-12 bg-white/50 backdrop-blur-sm p-4 rounded border-l-4" style={{ borderColor: primaryColor }}>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Factureren aan</h3>
          <p className="font-bold text-lg text-gray-800">{invoice.clientName}</p>
          <p className="text-gray-600 whitespace-pre-line">{invoice.clientAddress}</p>
        </div>

        <div className="mb-8 flex-grow">
          <table className="w-full">
            <thead>
              <tr className="border-b-2" style={{ borderColor: '#E5E7EB' }}>
                <th className="text-left py-3 text-sm font-bold" style={{ color: primaryColor }}>Omschrijving</th>
                <th className="text-right py-3 text-sm font-bold" style={{ color: primaryColor }}>Aantal</th>
                <th className="text-right py-3 text-sm font-bold" style={{ color: primaryColor }}>Prijs (excl.)</th>
                <th className="text-right py-3 text-sm font-bold" style={{ color: primaryColor }}>BTW</th>
                <th className="text-right py-3 text-sm font-bold" style={{ color: primaryColor }}>Totaal (excl.)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 text-sm text-gray-800">{item.description}</td>
                  <td className="py-4 text-right text-sm text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right text-sm text-gray-600">€ {Number(item.price).toFixed(2)}</td>
                  <td className="py-4 text-right text-sm text-gray-600">{item.vatRate}%</td>
                  <td className="py-4 text-right text-sm font-medium text-gray-800">€ {item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-3 bg-white/80 p-4 rounded shadow-sm">
            <div className="flex justify-between text-gray-600">
              <span>Totaal excl. BTW</span>
              <span>€ {subtotal.toFixed(2)}</span>
            </div>
            
            {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                    <span>Korting (excl. btw)</span>
                    <span>- € {discountAmount.toFixed(2)}</span>
                </div>
            )}

            <div className="border-t border-gray-100 pt-2">
                {Object.entries(vatBreakdown).map(([rate, amount]) => (
                    amount !== 0 && (
                        <div key={rate} className="flex justify-between text-gray-500 text-sm">
                            <span>BTW {rate}%</span>
                            <span>€ {amount.toFixed(2)}</span>
                        </div>
                    )
                ))}
            </div>

            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200" style={{ color: primaryColor }}>
              <span>Totaal incl. BTW</span>
              <span>€ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-8">
            {footerText}
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;