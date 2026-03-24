"use client";

import { useEffect, useState } from "react";

interface StockItem {
  id: number;
  sku: string;
  name: string;
  current_stock: number;
  min_stock: number;
  warehouse_name: string;
}

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/stock-movements/low-warnings")
      .then(res => res.json())
      .then(data => { setStock(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">📊 Estado del Stock</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          Exportar Excel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Cargando...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Stock Actual</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Stock Mínimo</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stock.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-blue-600">{s.sku || `PROD-${s.id}`}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{s.name}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">{s.current_stock}</td>
                  <td className="px-6 py-4 text-right text-slate-500">{s.min_stock}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${s.current_stock < s.min_stock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {s.current_stock < s.min_stock ? '⚠️ Crítico' : '✓ Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
