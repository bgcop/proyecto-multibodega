"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface ExitItem {
  id: number;
  product: { id: number; sku: string; name: string };
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Exit {
  id: number;
  reference: string;
  warehouse: { id: number; name: string };
  customer?: { id: number; name: string };
  exit_date: string;
  total_value: number;
  status: string;
  notes?: string;
  items: ExitItem[];
}

export default function DetalleSalidaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [exit, setExit] = useState<Exit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/exits/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Salida no encontrada");
        return res.json();
      })
      .then(data => {
        setExit(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !exit) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error || "Salida no encontrada"}</p>
          <button onClick={() => router.push("/salidas")} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
            Volver a Salidas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">📤 Detalle de Salida</h1>
          <p className="text-slate-500 mt-1 font-mono">{exit.reference}</p>
        </div>
        <Link href="/salidas" className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
          ← Volver
        </Link>
      </div>

      {/* Información General */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Información General</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-slate-500">Fecha</p>
            <p className="font-medium text-slate-800">{new Date(exit.exit_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Bodega</p>
            <p className="font-medium text-slate-800">{exit.warehouse?.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Cliente</p>
            <p className="font-medium text-slate-800">{exit.customer?.name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Estado</p>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${exit.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {exit.status === 'COMPLETED' ? '✓ Completado' : '⏳ Pendiente'}
            </span>
          </div>
        </div>
        {exit.notes && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">Notas</p>
            <p className="text-slate-700">{exit.notes}</p>
          </div>
        )}
      </div>

      {/* Items de la Salida */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Productos Despachados</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Producto</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Precio Unit.</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {exit.items?.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-blue-600 text-sm">{item.product?.sku}</td>
                <td className="px-6 py-4 text-slate-800">{item.product?.name}</td>
                <td className="px-6 py-4 text-right text-slate-800">{item.quantity}</td>
                <td className="px-6 py-4 text-right text-slate-700">${item.unit_price?.toFixed(2)}</td>
                <td className="px-6 py-4 text-right font-semibold text-slate-800">${item.total_price?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200">
            <tr>
              <td colSpan={4} className="px-6 py-4 text-right font-semibold text-slate-700">Total General:</td>
              <td className="px-6 py-4 text-right font-bold text-slate-800 text-lg">${exit.total_value?.toLocaleString() || "0.00"}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
