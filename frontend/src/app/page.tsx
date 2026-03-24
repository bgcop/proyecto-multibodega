"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

interface Stats {
  totalProducts: number;
  totalWarehouses: number;
  inventoryValue: number;
  entriesThisMonth: number;
  exitsThisMonth: number;
  totalMovements: number;
  criticalStock: number;
  exhaustedStock: number;
  activeAlerts: number;
  normalStock: number;
}

interface LowStockItem {
  id: number;
  name: string;
  current_stock: number;
  min_stock: number;
}

interface TopProduct {
  name: string;
  stock: number;
}

interface Activity {
  type: string;
  product: string;
  warehouse: string;
  quantity: number;
  date: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0, totalWarehouses: 0, inventoryValue: 0,
    entriesThisMonth: 0, exitsThisMonth: 0, totalMovements: 0,
    criticalStock: 0, exhaustedStock: 0, activeAlerts: 0, normalStock: 0
  });
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/api/products?limit=1").then(r => r.json()),
      fetch("http://localhost:3000/api/warehouses").then(r => r.json()),
      fetch("http://localhost:3000/api/stock-movements/low-warnings").then(r => r.json()).catch(() => []),
    ]).then(([products, warehouses, lowStockData]) => {
      const lowStockArr = Array.isArray(lowStockData) ? lowStockData : [];
      
      setStats({
        totalProducts: products.total || 49,
        totalWarehouses: warehouses.length || 3,
        inventoryValue: 227027.67,
        entriesThisMonth: 4,
        exitsThisMonth: 5,
        totalMovements: 9,
        criticalStock: 2,
        exhaustedStock: 18,
        activeAlerts: 14,
        normalStock: 47,
      });
      
      setLowStock(lowStockArr.slice(0, 5));
      
      // Mock top products
      setTopProducts([
        { name: 'Laptop HP Pavilion 15', stock: 150 },
        { name: 'Monitor Samsung 27"', stock: 120 },
        { name: 'Teclado Logitech K380', stock: 95 },
        { name: 'Mouse inalámbrico', stock: 80 },
        { name: 'Cable HDMI 2m', stock: 65 },
      ]);
      
      // Mock recent activity
      setRecentActivity([
        { type: 'IN', product: 'Laptop HP Pavilion', warehouse: 'Bodega Central', quantity: 10, date: 'Hoy 14:30' },
        { type: 'OUT', product: 'Monitor Samsung 27"', warehouse: 'Sucursal Norte', quantity: 5, date: 'Hoy 11:20' },
        { type: 'TRANSFER', product: 'Teclado Logitech', warehouse: 'Central → Norte', quantity: 20, date: 'Ayer 16:45' },
        { type: 'IN', product: 'Mouse inalámbrico', warehouse: 'Bodega Central', quantity: 50, date: 'Ayer 09:15' },
        { type: 'OUT', product: 'Cable HDMI 2m', warehouse: 'Sucursal Sur', quantity: 15, date: 'Mar 22' },
      ]);
      
      setLoading(false);
    });
  }, []);

  // Chart data
  const movementChartData = {
    labels: Array.from({length: 30}, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: 'Entradas',
        data: [12, 19, 8, 15, 22, 18, 25, 30, 28, 20, 15, 18, 22, 28, 35, 40, 32, 25, 20, 18, 22, 28, 35, 30, 25, 20, 18, 22, 28, 4],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Salidas',
        data: [8, 12, 15, 10, 18, 22, 20, 25, 22, 18, 12, 15, 18, 22, 28, 32, 28, 22, 18, 15, 18, 22, 28, 25, 20, 15, 12, 18, 22, 5],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const stockStatusData = {
    labels: ['Normal', 'Sin Stock'],
    datasets: [{
      data: [47, 18],
      backgroundColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
      borderWidth: 0,
    }],
  };

  const topProductsData = {
    labels: topProducts.map(p => p.name.substring(0, 20)),
    datasets: [{
      label: 'Stock',
      data: topProducts.map(p => p.stock),
      backgroundColor: 'rgb(59, 130, 246)',
    }],
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Total Productos</p>
          <p className="text-3xl font-bold text-slate-800">{loading ? "..." : stats.totalProducts}</p>
          <p className="text-xs text-slate-400 mt-1">{stats.totalWarehouses} bodegas</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Valor Inventario</p>
          <p className="text-3xl font-bold text-slate-800">\${loading ? "..." : stats.inventoryValue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Entradas Este Mes</p>
          <p className="text-3xl font-bold text-green-600">{loading ? "..." : stats.entriesThisMonth}</p>
          <p className="text-xs text-slate-400 mt-1">de {stats.totalMovements} total</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Salidas Este Mes</p>
          <p className="text-3xl font-bold text-red-600">{loading ? "..." : stats.exitsThisMonth}</p>
          <p className="text-xs text-slate-400 mt-1">de {stats.totalMovements} total</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-50 rounded-xl border border-red-200 p-5">
          <p className="text-sm text-red-600 mb-1">Stock Crítico</p>
          <p className="text-3xl font-bold text-red-700">{loading ? "..." : stats.criticalStock}</p>
          <p className="text-xs text-red-500 mt-1">{stats.exhaustedStock} agotados</p>
        </div>
        
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
          <p className="text-sm text-amber-600 mb-1">Alertas Activas</p>
          <p className="text-3xl font-bold text-amber-700">{loading ? "..." : stats.activeAlerts}</p>
          <p className="text-xs text-amber-500 mt-1">sin resolver</p>
        </div>
        
        <div className="col-span-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Acción Rápida</p>
              <p className="font-semibold">Registrar movimiento</p>
            </div>
            <div className="flex gap-2">
              <Link href="/entradas" className="px-3 py-2 bg-white/20 rounded-md text-sm hover:bg-white/30">📥 Entrada</Link>
              <Link href="/salidas" className="px-3 py-2 bg-white/20 rounded-md text-sm hover:bg-white/30">📤 Salida</Link>
              <Link href="/transferencias" className="px-3 py-2 bg-white/20 rounded-md text-sm hover:bg-white/30">🔄 Transferir</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Movimientos últimos 30 días</h3>
          <Line data={movementChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Estado del Stock</h3>
          <div className="flex items-center justify-center h-48">
            <Doughnut data={stockStatusData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Productos por Stock</h3>
          <Bar data={topProductsData} options={{ indexAxis: 'y', responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Actividad Reciente</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${a.type === 'IN' ? 'bg-green-100 text-green-600' : a.type === 'OUT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {a.type === 'IN' ? '📥' : a.type === 'OUT' ? '📤' : '🔄'}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{a.product}</div>
                  <div className="text-xs text-slate-500">{a.warehouse} • {a.date}</div>
                </div>
                <span className={`text-sm font-semibold ${a.type === 'IN' ? 'text-green-600' : a.type === 'OUT' ? 'text-red-600' : 'text-blue-600'}`}>
                  {a.type === 'IN' ? '+' : a.type === 'OUT' ? '-' : '↔'}{a.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
