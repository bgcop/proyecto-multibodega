"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface CountItem {
  id: number;
  product: { id: number; sku: string; name: string };
  system_stock: number;
  physical_stock: number | null;
  difference: number | null;
}

interface PhysicalCount {
  id: number;
  reference: string;
  warehouse: { id: number; name: string };
  count_date: string;
  status: string;
  items: CountItem[];
}

export default function CapturarConteoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [count, setCount] = useState<PhysicalCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch(`http://localhost:3000/api/physical-counts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Conteo no encontrado");
        return res.json();
      })
      .then(data => {
        setCount(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handlePhysicalStockChange = (itemId: number, value: string) => {
    if (!count) return;
    const numValue = value === "" ? null : parseInt(value);
    
    setCount({
      ...count,
      items: count.items.map(item => {
        if (item.id === itemId) {
          const physical_stock = numValue;
          const difference = physical_stock !== null ? physical_stock - item.system_stock : null;
          return { ...item, physical_stock, difference };
        }
        return item;
      })
    });
  };

  const handleSaveItem = async (itemId: number) => {
    if (!count) return;
    const item = count.items.find(i => i.id === itemId);
    if (!item) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/physical-counts/${id}/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ physical_stock: item.physical_stock }),
      });

      if (!res.ok) throw new Error("Error al guardar");
      setEditMode(prev => ({ ...prev, [itemId]: false }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteCount = async () => {
    // Verificar que todos los items tengan conteo físico
    const uncounted = count?.items.filter(i => i.physical_stock === null);
    if (uncounted && uncounted.length > 0) {
      if (!confirm(`Hay ${uncounted.length} productos sin contar. ¿Desea completar el conteo de todas formas?`)) {
        return;
      }
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/physical-counts/${id}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error("Error al completar conteo");
      router.push("/conteo-fisico");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !count) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error || "Conteo no encontrado"}</p>
          <button onClick={() => router.push("/conteo-fisico")} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
            Volver a Conteos
          </button>
        </div>
      </div>
    );
  }

  const countedItems = count.items.filter(i => i.physical_stock !== null).length;
  const matchedItems = count.items.filter(i => i.difference === 0).length;
  const mismatchedItems = count.items.filter(i => i.difference !== null && i.difference !== 0).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">📋 Captura de Conteo</h1>
          <p className="text-slate-500 mt-1 font-mono">{count.reference} - {count.warehouse?.name}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/conteo-fisico" className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
            ← Volver
          </Link>
          {count.status !== 'COMPLETED' && (
            <button
              onClick={handleCompleteCount}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "✓ Completar Conteo"}
            </button>
          )}
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Productos</p>
          <p className="text-2xl font-bold text-slate-800">{count.items.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Contados</p>
          <p className="text-2xl font-bold text-blue-600">{countedItems}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Coinciden</p>
          <p className="text-2xl font-bold text-green-600">{matchedItems}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Diferencias</p>
          <p className="text-2xl font-bold text-red-600">{mismatchedItems}</p>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Producto</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Stock Sistema</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Stock Físico</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Diferencia</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {count.items.map((item) => (
              <tr key={item.id} className={`hover:bg-slate-50 ${item.difference !== null && item.difference !== 0 ? 'bg-red-50' : ''}`}>
                <td className="px-6 py-4 font-mono text-blue-600 text-sm">{item.product?.sku}</td>
                <td className="px-6 py-4 text-slate-800">{item.product?.name}</td>
                <td className="px-6 py-4 text-right font-medium text-slate-700">{item.system_stock}</td>
                <td className="px-6 py-4 text-right">
                  {count.status === 'COMPLETED' ? (
                    <span className="font-semibold">{item.physical_stock ?? "-"}</span>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      value={item.physical_stock ?? ""}
                      onChange={(e) => handlePhysicalStockChange(item.id, e.target.value)}
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {item.difference !== null ? (
                    <span className={`font-bold ${item.difference > 0 ? 'text-green-600' : item.difference < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                      {item.difference > 0 ? '+' : ''}{item.difference}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {count.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleSaveItem(item.id)}
                      disabled={saving}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Guardar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
