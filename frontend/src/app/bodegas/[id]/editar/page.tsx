"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function EditarBodegaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({ code: "", name: "", address: "", manager: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/api/warehouses/${id}`)
      .then(data => {
        setForm({
          code: data.code || "",
          name: data.name || "",
          address: data.address || "",
          manager: data.manager || ""
        });
        setLoadingData(false);
      })
      .catch(() => {
        setError("Error al cargar bodega");
        setLoadingData(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiFetch(`/api/warehouses/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      router.push("/bodegas");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Editar Bodega</h1>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Código *</label>
            <input required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono" placeholder="BOD-001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
          <input value={form.address} onChange={e => setForm({...form, address: e.target.value})}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Encargado</label>
          <input value={form.manager} onChange={e => setForm({...form, manager: e.target.value})}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
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
