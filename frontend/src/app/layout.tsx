import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multi-Bodega | Core Inventory",
  description: "Enterprise System para gestión de Stock via Movimientos Inmutables",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
          
          {/* Navegación Lateral */}
          <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 shadow-sm flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
              <span className="text-xl font-bold tracking-tight text-blue-600">Bodegas</span>
              <span className="text-xl font-bold tracking-tight text-slate-800 ml-1">Core</span>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
              <a href="#" className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Dashboard
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                Productos
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Bodegas
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                Movimientos
              </a>
            </nav>
            
            <div className="p-4 border-t border-slate-100">
              <div className="flex items-center space-x-3 text-sm">
                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center font-bold">A</div>
                 <div>
                   <p className="font-semibold text-slate-800">Admin User</p>
                   <p className="text-slate-500 text-xs text-ellipsis">admin@sistema.local</p>
                 </div>
              </div>
            </div>
          </aside>

          {/* Area Principal */}
          <main className="flex-1 flex flex-col overflow-y-auto">
            <header className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center px-4 md:px-8 justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Visión General</h2>
              <button className="btn-primary text-sm font-medium">Nueva Transferencia</button>
            </header>
            
            <div className="p-4 md:p-8">
              {children}
            </div>
          </main>

        </div>
      </body>
    </html>
  );
}
