"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Entry {
  id: number;
  reference: string;
  warehouse: { name: string };
  supplier?: { name: string };
  entry_date: string;
  total_value: number;
  status: string;
  items: { product: { name: string }; quantity: number; unit_cost: number }[];
}

export default function EntradasPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/entries")
      .then(res => res.json())
      .then(data => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">📥 Entradas de Inventario</h1>
        <Link href="/entradas/nuevo" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
          + Nueva Entrada
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Cargando...</div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No hay entradas registradas
            <br />
            <span className="text-sm">Haz clic en "Nueva Entrada" para registrar mercadería</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Referencia</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Bodega</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Proveedor</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Valor Total</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map(e => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-green-600">{e.reference}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(e.entry_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-800">{e.warehouse?.name}</td>
                  <td className="px-6 py-4 text-slate-500">{e.supplier?.name || "-"}</td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-800">\${e.total_value?.toLocaleString() || "0"}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${e.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {e.status === 'COMPLETED' ? '✓ Completado' : '⏳ Pendiente'}
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
