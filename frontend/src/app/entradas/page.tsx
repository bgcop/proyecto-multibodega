"use client";

import { useEffect, useState } from "react";

export default function EntradasPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">📥 Entradas de Inventario</h1>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
          + Nueva Entrada
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p className="text-slate-500 text-center py-8">
          Formulario para registrar entradas de mercadería desde proveedores.
          <br /><br />
          <span className="text-sm text-slate-400">Funcionalidad en desarrollo...</span>
        </p>
      </div>
    </div>
  );
}
