"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TransfersPage() {
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState("");
  const [originWH, setOriginWH] = useState("");
  const [targetWH, setTargetWH] = useState("");
  const [qty, setQty] = useState("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/stock-movements/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer DEV_TOKEN" // Mmockeado, requiere integracion de AuthContext
        },
        body: JSON.stringify({
          productId: parseInt(productId),
          sourceWarehouseId: parseInt(originWH),
          targetWarehouseId: parseInt(targetWH),
          quantity: parseInt(qty),
          reason: "Transferencia generada desde UI"
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al transferir. Tal vez stock insuficiente.");
      }

      toast.success("Transferencia Completada: Stock movido exitosamente.");
      setQty("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Transferencias de Stock</h2>
          <p className="text-slate-500 mt-1">Mueve inventario entre bodegas físicas asegurando transacciones ACID.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario Izquierda */}
        <div className="col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold border-b pb-4 mb-4">Nueva Operación</h3>
          <form onSubmit={handleTransfer} className="space-y-4">
            
            <div className="space-y-2">
              <Label>Producto (ID/SKU)</Label>
              <Input 
                type="number" 
                placeholder="Ej. ID 1" 
                required 
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Bodega de Origen</Label>
              <Select value={originWH} onValueChange={(val) => setOriginWH(val || '')} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione Origen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Bodega Central</SelectItem>
                  <SelectItem value="2">Bodega Norte</SelectItem>
                  <SelectItem value="3">Anexo D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bodega Destino</Label>
              <Select value={targetWH} onValueChange={(val) => setTargetWH(val || '')} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione Destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Bodega Central</SelectItem>
                  <SelectItem value="2">Bodega Norte</SelectItem>
                  <SelectItem value="3">Anexo D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cantidad a transferir (Unidades)</Label>
              <Input 
                type="number" 
                min="1" 
                placeholder="Ej. 50" 
                required
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Procesando..." : "Ejecutar Transferencia"}
            </Button>
          </form>
        </div>

        {/* Historico Derecha */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h3 className="text-lg font-semibold">Historial de Operaciones</h3>
             <Button variant="outline" size="sm">Filtrar</Button>
          </div>
          <Table>
            <TableCaption>Muestra las últimas transacciones inter-bodegas.</TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Origen &rarr; Destino</TableHead>
                <TableHead className="text-right">Unidades</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Mock Data */}
              <TableRow>
                <TableCell>Hoy, 14:30</TableCell>
                <TableCell className="font-medium">Ryzen 5900X</TableCell>
                <TableCell>Bodega Central &rarr; Bodega Norte</TableCell>
                <TableCell className="text-right font-bold text-blue-600">50</TableCell>
                <TableCell><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Liquidada</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ayer, 09:15</TableCell>
                <TableCell className="font-medium">Teclado Keychron</TableCell>
                <TableCell>Anexo D &rarr; Bodega Central</TableCell>
                <TableCell className="text-right font-bold text-blue-600">20</TableCell>
                <TableCell><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Liquidada</span></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
