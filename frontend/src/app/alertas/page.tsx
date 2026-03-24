"use client";

import { useEffect, useState } from "react";

interface Alert {
  id: number;
  type: string;
  message: string;
  product_name: string;
  created_at: string;
  resolved: boolean;
}

export default function AlertasPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/stock-movements/low-warnings")
      .then(res => res.json())
      .then(data => {
        const mapped = (data || []).map((d: any, i: number) => ({
          id: i + 1,
          type: 'STOCK_LOW',
          message: `Stock actual (${d.current_stock}) por debajo del mínimo (${d.min_stock})`,
          product_name: d.name,
          created_at: new Date().toISOString(),
          resolved: false
        }));
        setAlerts(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">⚠️ Alertas Activas</h1>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          {alerts.filter(a => !a.resolved).length} sin resolver
        </span>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center text-slate-500">Cargando...</div>
        ) : alerts.length === 0 ? (
          <div className="bg-green-50 rounded-xl border border-green-200 p-6 text-center">
            <span className="text-2xl">✅</span>
            <p className="text-green-800 font-medium mt-2">No hay alertas activas</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold text-red-800">{alert.product_name}</p>
                <p className="text-sm text-red-600">{alert.message}</p>
              </div>
              <button className="px-3 py-1 bg-white border border-red-300 text-red-700 rounded-md text-sm hover:bg-red-100">
                Resolver
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
