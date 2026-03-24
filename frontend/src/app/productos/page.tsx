"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  minStock: number;
  category?: { name: string };
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/products?page=${page}&limit=10`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Catálogo de Productos</h1>
        <Link href="/productos/nuevo" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          + Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Mín</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Cargando...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No hay productos registrados</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-blue-600">{p.sku}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{p.category?.name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-slate-700">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-500">{p.minStock}</td>
                  <td className="px-6 py-4 text-center">
                    <Link 
                      href={`/productos/${p.id}/editar`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded text-sm disabled:opacity-50" disabled={page === 1}>Anterior</button>
        <span className="px-3 py-1 text-sm text-slate-600">Página {page}</span>
        <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded text-sm">Siguiente</button>
      </div>
    </div>
  );
}
