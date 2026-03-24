"use client";

import { useEffect, useState } from "react";

interface Product { id: number; sku: string; name: string; }
interface Warehouse { id: number; code: string; name: string; }

export default function TransferenciasPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    productId: "", sourceWarehouseId: "", targetWarehouseId: "", quantity: "1", reason: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/products?limit=100")
      .then(res => res.json())
      .then(data => setProducts(data.data || data))
      .catch(() => {});
    
    fetch("http://localhost:3000/api/warehouses")
      .then(res => res.json())
      .then(data => setWarehouses(data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para realizar transferencias");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/stock-movements/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: \`Bearer \${token}\`,
        },
        body: JSON.stringify({
          productId: parseInt(form.productId),
          sourceWarehouseId: parseInt(form.sourceWarehouseId),
          targetWarehouseId: parseInt(form.targetWarehouseId),
          quantity: parseInt(form.quantity),
          reason: form.reason || "Transferencia entre bodegas",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en transferencia");
      
      setSuccess(\`✅ Transferencia registrada exitosamente (ID: \${data.transaction_id})\`);
      setForm({ productId: "", sourceWarehouseId: "", targetWarehouseId: "", quantity: "1", reason: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Transferencia de Mercadería</h1>
        <p className="text-slate-500 mt-1">Mueve productos entre bodegas de forma segura y trazable</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md">
          <p className="text-sm text-green-700 font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Producto *</label>
          <select required value={form.productId} onChange={e => setForm({...form, productId: e.target.value})}
            className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Seleccionar producto...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bodega Origen *</label>
            <select required value={form.sourceWarehouseId} onChange={e => setForm({...form, sourceWarehouseId: e.target.value})}
              className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Seleccionar origen...</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bodega Destino *</label>
            <select required value={form.targetWarehouseId} onChange={e => setForm({...form, targetWarehouseId: e.target.value})}
              className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Seleccionar destino...</option>
              {warehouses.filter(w => w.id.toString() !== form.sourceWarehouseId).map(w => (
                <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cantidad *</label>
            <input type="number" min="1" required value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Motivo / Referencia</label>
            <input value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Opcional" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs text-amber-800">
          ⚠️ <strong>Importante:</strong> El sistema validará que exista stock suficiente en la bodega de origen antes de procesar la transferencia.
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-70">
            {loading ? "Procesando..." : "🔄 Ejecutar Transferencia"}
          </button>
        </div>
      </form>
    </div>
  );
}
