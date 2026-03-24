"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Unit {
  id: number;
  code: string;
  name: string;
  symbol?: string;
}

export default function UnidadesPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/units")
      .then(res => res.json())
      .then(data => { setUnits(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Unidades de Medida</h1>
        <Link href="/unidades/nuevo" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          + Nueva Unidad
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Cargando...</div>
        ) : units.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No hay unidades registradas</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Símbolo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {units.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-blue-600">{u.code}</td>
                  <td className="px-6 py-4 text-slate-800">{u.name}</td>
                  <td className="px-6 py-4 text-slate-500">{u.symbol || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
