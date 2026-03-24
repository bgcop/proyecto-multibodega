"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    sku: "", name: "", description: "", price: "", minStock: "0", categoryId: "", imageUrl: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch<any[]>("/api/categories"),
      apiFetch<any>(`/api/products/${id}`)
    ])
      .then(([catsData, product]) => {
        setCategories(catsData);
        setForm({
          sku: product.sku || "",
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          minStock: product.minStock?.toString() || "0",
          categoryId: product.categoryId?.toString() || "",
          imageUrl: product.imageUrl || ""
        });
        setLoadingData(false);
      })
      .catch(() => {
        setError("Error al cargar datos");
        setLoadingData(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiFetch(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          minStock: parseInt(form.minStock) || 0,
          categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        }),
      });
      router.push("/productos");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Editar Producto</h1>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SKU *</label>
            <input required value={form.sku} onChange={e => setForm({...form, sku: e.target.value})}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Precio *</label>
            <input type="number" step="0.01" min="0" required value={form.price} onChange={e => setForm({...form, price: e.target.value})}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stock Mínimo</label>
            <input type="number" min="0" value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Sin categoría</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">URL Imagen</label>
          <input type="url" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://" />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-70">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-sm font-medium">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
