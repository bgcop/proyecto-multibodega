"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, API_URL } from "@/lib/api";

interface Warehouse { id: number; name: string; }
interface Supplier { id: number; name: string; }
interface Product { id: number; name: string; sku: string; }

interface EntryItem {
  product_id: number;
  quantity: number;
  unit_cost: number;
}

export default function NuevaEntradaPage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    warehouse_id: "",
    supplier_id: "",
    notes: "",
  });
  
  const [items, setItems] = useState<EntryItem[]>([{ product_id: 0, quantity: 1, unit_cost: 0 }]);

  useEffect(() => {
    Promise.all([
      apiFetch<Warehouse[]>("/api/warehouses"),
      apiFetch<Supplier[]>("/api/suppliers"),
      apiFetch<{ data: Product[] } | Product[]>("/api/products?limit=100"),
    ]).then(([w, s, p]) => {
      setWarehouses(w);
      setSuppliers(s);
      setProducts(Array.isArray(p) ? p : p.data || []);
    });
  }, []);

  const addItem = () => {
    setItems([...items, { product_id: 0, quantity: 1, unit_cost: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const validItems = items.filter(i => i.product_id && i.quantity > 0);
      
      if (!form.warehouse_id) throw new Error("Selecciona una bodega");
      if (validItems.length === 0) throw new Error("Agrega al menos un producto");

      await apiFetch("/api/entries", {
        method: "POST",
        body: JSON.stringify({
          warehouse_id: parseInt(form.warehouse_id),
          supplier_id: form.supplier_id ? parseInt(form.supplier_id) : null,
          notes: form.notes,
          items: validItems,
        }),
      });
      
      router.push("/entradas");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalValue = items.reduce((sum, i) => sum + (i.quantity * i.unit_cost), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">📥 Nueva Entrada de Inventario</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Información General</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bodega Destino *</label>
              <select
                required
                value={form.warehouse_id}
                onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar...</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proveedor</label>
              <select
                value={form.supplier_id}
                onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Sin proveedor</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows={2}
              placeholder="Observaciones..."
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Productos</h3>
            <button type="button" onClick={addItem} className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200">
              + Agregar Producto
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Producto</label>
                  <select
                    value={item.product_id}
                    onChange={(e) => updateItem(index, "product_id", parseInt(e.target.value))}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  >
                    <option value={0}>Seleccionar...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Costo Unit.</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unit_cost}
                    onChange={(e) => updateItem(index, "unit_cost", parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <div className="text-right flex-1">
                    <div className="text-xs text-slate-500">Subtotal</div>
                    <div className="font-semibold text-slate-800">\${(item.quantity * item.unit_cost).toLocaleString()}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                    disabled={items.length === 1}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <div className="text-right">
              <div className="text-sm text-slate-500">Total Entrada</div>
              <div className="text-2xl font-bold text-green-600">\${totalValue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium">
            {loading ? "Registrando..." : "✓ Registrar Entrada"}
          </button>
        </div>
      </form>
    </div>
  );
}
