"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalProducts: number;
  totalWarehouses: number;
  lowStockCount: number;
  movementsToday: number;
}

interface LowStockItem {
  id: number;
  name: string;
  current_stock: number;
  min_stock: number;
}

interface Movement {
  id: number;
  product_name: string;
  type: string;
  quantity: number;
  source_name?: string;
  target_name?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalWarehouses: 0, lowStockCount: 0, movementsToday: 0 });
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [recentMovements, setRecentMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/api/products?limit=1").then(r => r.json()),
      fetch("http://localhost:3000/api/warehouses").then(r => r.json()),
      fetch("http://localhost:3000/api/stock-movements/low-warnings").then(r => r.json()).catch(() => []),
    ]).then(([products, warehouses, lowStockData]) => {
      setStats({
        totalProducts: products.total || products.length || 0,
        totalWarehouses: warehouses.length || 0,
        lowStockCount: Array.isArray(lowStockData) ? lowStockData.length : 0,
        movementsToday: Math.floor(Math.random() * 50) + 10, // Mock por ahora
      });
      setLowStock(Array.isArray(lowStockData) ? lowStockData : []);
      setLoading(false);
    });
  }, []);

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      IN: "bg-green-100 text-green-800",
      OUT: "bg-red-100 text-red-800",
      TRANSFER: "bg-blue-100 text-blue-800",
    };
    return styles[type] || "bg-slate-100 text-slate-800";
  };

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Total Productos</p>
          <p className="text-3xl font-bold text-slate-800">{loading ? "..." : stats.totalProducts}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Bodegas Activas</p>
          <p className="text-3xl font-bold text-slate-800">{loading ? "..." : stats.totalWarehouses}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Movimientos Hoy</p>
          <p className="text-3xl font-bold text-slate-800">{stats.movementsToday}</p>
        </div>
        <div className={`rounded-xl shadow-sm border p-5 ${stats.lowStockCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
          <p className={`text-sm mb-1 ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-slate-500'}`}>Alertas de Stock</p>
          <p className={`text-3xl font-bold ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>{stats.lowStockCount}</p>
        </div>
      </div>

      {/* Alertas de Stock Bajo */}
      {stats.lowStockCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
          <h3 className="text-sm font-semibold text-red-800 mb-3">⚠️ Productos con Stock Bajo</h3>
          <div className="space-y-2">
            {lowStock.slice(0, 5).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-red-700">{item.name}</span>
                <span className="text-red-600 font-medium">{item.current_stock} / {item.min_stock} mín</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/transferencias" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔄</span>
            <h3 className="text-lg font-semibold">Nueva Transferencia</h3>
          </div>
          <p className="text-blue-100 text-sm">Mueve productos entre bodegas de forma segura</p>
        </a>

        <a href="/productos" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📦</span>
            <h3 className="text-lg font-semibold text-slate-800">Gestionar Productos</h3>
          </div>
          <p className="text-slate-500 text-sm">Catálogo completo con SKUs y categorías</p>
        </a>

        <a href="/bodegas" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🏭</span>
            <h3 className="text-lg font-semibold text-slate-800">Ver Bodegas</h3>
          </div>
          <p className="text-slate-500 text-sm">Ubicaciones y encargados del inventario</p>
        </a>
      </div>
    </>
  );
}
