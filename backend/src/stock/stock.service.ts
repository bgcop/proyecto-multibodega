import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { StockMovement, StockMovementType } from '../entities/stock-movement.entity';
import { Product } from '../entities/product.entity';
import { Warehouse } from '../entities/warehouse.entity';

@Injectable()
export class StockService {
  constructor(private dataSource: DataSource) {}

  /**
   * Calculo en tiempo real de Stock via reduccion/suma.
   */
  async getStock(productId: number, warehouseId: number): Promise<number> {
    const movements = await this.dataSource.manager.find(StockMovement, {
       where: [
         { product: { id: productId }, sourceWarehouse: { id: warehouseId } },
         { product: { id: productId }, targetWarehouse: { id: warehouseId } }
       ]
    });
    
    return movements.reduce((acc, mov) => {
       if (mov.targetWarehouse?.id === warehouseId) return acc + mov.quantity;
       if (mov.sourceWarehouse?.id === warehouseId) return acc - mov.quantity;
       return acc;
    }, 0);
  }

  /**
   * Ejecución ACID (PostgreSQL Query Runner) para Transferencia.
   */
  async executeTransfer(productId: number, sourceId: number, targetId: number, qty: number, reason: string, userId?: number) {
    if (qty <= 0) throw new BadRequestException("La cantidad debe ser mayor a 0");
    if (sourceId === targetId) throw new BadRequestException("No puedes transferir a la misma bodega");

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Obtener Instancias Reales (Lock optimista para prevenir Race Conditions en Stock)
      const product = await queryRunner.manager.findOne(Product, { where: { id: productId } });
      const sourceWH = await queryRunner.manager.findOne(Warehouse, { where: { id: sourceId } });
      const targetWH = await queryRunner.manager.findOne(Warehouse, { where: { id: targetId } });

      if (!product || !sourceWH || !targetWH) throw new Error("Entidades inválidas");

      // 2. Comprobar Stock Real en tiempo ejecución antes del lock.
      const currentStock = await this.getStock(productId, sourceId);
      if (currentStock < qty) {
         throw new Error(`Stock insuficiente. Solo tienes ${currentStock} uds en la bodega Origen.`);
      }

      // 3. Crear Movimiento de Bodega. Una transferencia es un unico Registro que señala su origen y destino
      const movement = new StockMovement();
      movement.type = StockMovementType.TRANSFER;
      movement.quantity = qty;
      movement.user_id = userId;
      movement.reason = reason || 'Transferencia Inter-Bodega';
      movement.product = product;
      movement.sourceWarehouse = sourceWH;
      movement.targetWarehouse = targetWH;
      
      const result = await queryRunner.manager.save(movement);
      
      await queryRunner.commitTransaction();
      return { success: true, transaction_id: result.id, data: result };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  /**
   * Alertas de Quiebre de Stock (Stock vs MinStock)
   * En produccion esto seria un PostgreSQL View, se simplifica para MVP de calculo en memoria base.
   */
    async getLowStockWarnings() {
        // Optimizacion: Para requerimiento complejo sum(in)-sum(out) vs Product.min_stock
        const query = `
          WITH stock_status AS (
            SELECT
                p.id, p.name, p.min_stock,
                COALESCE(SUM(CASE WHEN sm.target_warehouse_id IS NOT NULL THEN sm.quantity ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN sm.source_warehouse_id IS NOT NULL THEN sm.quantity ELSE 0 END), 0) as current_stock
            FROM products p
            LEFT JOIN stock_movements sm ON sm.product_id = p.id
            GROUP BY p.id
          )
          SELECT * FROM stock_status WHERE current_stock < min_stock
        `;
      return await this.dataSource.query(query);
  }

}
