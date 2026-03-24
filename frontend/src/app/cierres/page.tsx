"use client";

import { useEffect, useState } from "react";
import { apiFetch, API_URL } from "@/lib/api";

interface Closure {
  id: number;
  reference: string;
  warehouse: { name: string };
  closure_date: string;
  period_month: number;
  period_year: number;
  total_value: number;
  total_products: number;
}

export default function CierresPage() {
  const [closures, setClosures] = useState<Closure[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch<Closure[]>("/api/closures"),
      apiFetch<any[]>("/api/warehouses"),
    ]).then(([c, w]) => {
      setClosures(c);
      setWarehouses(w);
      setLoading(false);
    });
  }, []);

  const handleCreate = async () => {
    if (!selectedWarehouse) return;
    
    await apiFetch("/api/closures", {
      method: "POST",
      body: JSON.stringify({ warehouse_id: parseInt(selectedWarehouse) }),
    });
    
    setShowModal(false);
    const updated = await apiFetch<Closure[]>("/api/closures");
    setClosures(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">🔒 Cierres de Inventario</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Nuevo Cierre
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nuevo Cierre de Inventario</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
              ⚠️ El cierre guardará un snapshot del stock actual. Esta acción no se puede deshacer.
            </div>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4"
            >
              <option value="">Seleccionar bodega...</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg">Cancelar</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Crear Cierre</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Cargando...</div>
        ) : closures.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No hay cierres registrados
            <br />
            <span className="text-sm">Los cierres mensuales permiten mantener un historial del valor del inventario</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Referencia</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Período</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Bodega</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Productos</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Valor Inventario</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Fecha Cierre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {closures.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-blue-600">{c.reference}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{c.period_month}/{c.period_year}</td>
                  <td className="px-6 py-4 text-slate-800">{c.warehouse?.name}</td>
                  <td className="px-6 py-4 text-center font-semibold">{c.total_products}</td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">\${c.total_value?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(c.closure_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
