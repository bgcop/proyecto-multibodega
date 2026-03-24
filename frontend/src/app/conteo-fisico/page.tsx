"use client";

import { useEffect, useState } from "react";

interface PhysicalCount {
  id: number;
  reference: string;
  warehouse: { name: string };
  count_date: string;
  status: string;
  total_items: number;
  matched_items: number;
  mismatched_items: number;
}

export default function ConteoFisicoPage() {
  const [counts, setCounts] = useState<PhysicalCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/api/physical-counts").then(r => r.json()),
      fetch("http://localhost:3000/api/warehouses").then(r => r.json()),
    ]).then(([c, w]) => {
      setCounts(c);
      setWarehouses(w);
      setLoading(false);
    });
  }, []);

  const handleCreate = async () => {
    if (!selectedWarehouse) return;
    
    const token = localStorage.getItem("token");
    await fetch("http://localhost:3000/api/physical-counts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ warehouse_id: parseInt(selectedWarehouse) }),
    });
    
    setShowModal(false);
    const updated = await fetch("http://localhost:3000/api/physical-counts").then(r => r.json());
    setCounts(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">📋 Conteo Físico de Inventario</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Nuevo Conteo
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nuevo Conteo Físico</h3>
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
              <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Crear Conteo</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Cargando...</div>
        ) : counts.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No hay conteos registrados
            <br />
            <span className="text-sm">Crea un nuevo conteo para iniciar el inventario físico</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Referencia</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Bodega</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Productos</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Coinciden</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Diferencias</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {counts.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-blue-600">{c.reference}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(c.count_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-800">{c.warehouse?.name}</td>
                  <td className="px-6 py-4 text-center font-semibold">{c.total_items}</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">{c.matched_items}</td>
                  <td className="px-6 py-4 text-center text-red-600 font-semibold">{c.mismatched_items}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      c.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      c.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {c.status === 'COMPLETED' ? '✓ Completado' : c.status === 'IN_PROGRESS' ? '⏳ En Proceso' : '✕ Cancelado'}
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
