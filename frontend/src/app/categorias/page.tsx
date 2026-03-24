"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  description?: string;
  parent_category?: { name: string };
  subcategories?: Category[];
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then(res => res.json())
      .then(data => { setCategories(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Categorías de Productos</h1>
        <Link href="/categorias/nuevo" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          + Nueva Categoría
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Cargando...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No hay categorías registradas</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Padre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{c.name}</td>
                  <td className="px-6 py-4 text-slate-500">{c.parent_category?.name || "-"}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{c.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
