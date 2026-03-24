"use client";

export default function ConteoFisicoPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">📋 Conteo Físico</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          + Nuevo Conteo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p className="text-slate-500 text-center py-8">
          Módulo para realizar inventarios físicos y comparar con stock del sistema.
          <br /><br />
          <span className="text-sm text-slate-400">Funcionalidad en desarrollo...</span>
        </p>
      </div>
    </div>
  );
}
