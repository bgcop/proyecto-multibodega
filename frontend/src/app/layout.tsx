import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multi-Bodega | Sistema de Inventario",
  description: "Gestión de inventario multi-bodega con trazabilidad completa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <div className="flex h-screen overflow-hidden">
          
          {/* Sidebar Completo */}
          <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col overflow-y-auto">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
              <span className="text-xl font-bold tracking-tight text-blue-600">Multi</span>
              <span className="text-xl font-bold tracking-tight text-slate-800 ml-1">Bodega</span>
            </div>
            
            <nav className="flex-1 py-4 text-sm">
              {/* Catálogo */}
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Catálogo</span>
              </div>
              <div className="space-y-0.5 mb-4">
                <a href="/productos" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">📦</span>
                  Productos
                </a>
                <a href="/categorias" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">🏷️</span>
                  Categorías
                </a>
                <a href="/unidades" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">📏</span>
                  Unidades de Medida
                </a>
              </div>

              {/* Terceros */}
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Terceros</span>
              </div>
              <div className="space-y-0.5 mb-4">
                <a href="/clientes" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">👥</span>
                  Clientes
                </a>
                <a href="/proveedores" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">🏭</span>
                  Proveedores
                </a>
              </div>

              {/* Movimientos */}
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Movimientos</span>
              </div>
              <div className="space-y-0.5 mb-4">
                <a href="/entradas" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">📥</span>
                  Entradas
                </a>
                <a href="/salidas" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">📤</span>
                  Salidas
                </a>
                <a href="/stock" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">📊</span>
                  Stock
                </a>
                <a href="/transferencias" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">🔄</span>
                  Transferencias
                </a>
              </div>

              {/* Control de Inventario */}
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Control de Inventario</span>
              </div>
              <div className="space-y-0.5 mb-4">
                <a href="/bodegas" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">🏠</span>
                  Bodegas
                </a>
                <a href="/conteo-fisico" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">📋</span>
                  Conteo Físico
                </a>
                <a href="/cierres" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">🔒</span>
                  Cierres
                </a>
                <a href="/alertas" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span className="w-5 h-5 mr-3 text-center">⚠️</span>
                  Alertas
                </a>
              </div>
            </nav>
            
            {/* Usuario */}
            <div className="p-4 border-t border-slate-100">
              <a href="/login" className="flex items-center space-x-3 text-sm hover:bg-slate-50 rounded-lg p-2 -m-2 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center font-bold text-xs">AD</div>
                <div>
                  <p className="font-semibold text-slate-800 text-xs">Admin</p>
                  <p className="text-slate-400 text-xs">Cerrar sesión</p>
                </div>
              </a>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-y-auto">
            <header className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center px-8 justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Sistema de Inventario Multi-Bodega</h2>
              <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                🏠 Dashboard
              </a>
            </header>
            
            <div className="p-8">
              {children}
            </div>
          </main>

        </div>
      </body>
    </html>
  );
}
