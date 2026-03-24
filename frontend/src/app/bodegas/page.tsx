"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Warehouse {
  id: number;
  code: string;
  name: string;
  address?: string;
  manager?: string;
}

export default function BodegasPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/warehouses")
      .then((res) => res.json())
      .then((data) => {
        setWarehouses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Bodegas</h1>
        <Link href="/bodegas/nuevo" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          + Nueva Bodega
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-500">Cargando...</div>
        ) : warehouses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">No hay bodegas registradas</div>
        ) : (
          warehouses.map((w) => (
            <div key={w.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {w.code}
                </span>
                <Link 
                  href={`/bodegas/${w.id}/editar`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Editar
                </Link>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{w.name}</h3>
              {w.address && <p className="text-sm text-slate-500 mb-1">📍 {w.address}</p>}
              {w.manager && <p className="text-sm text-slate-500">👤 {w.manager}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
