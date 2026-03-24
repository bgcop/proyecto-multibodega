import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventoryClosure } from '../entities/inventory-closure.entity';

@Injectable()
export class ClosuresService {
  constructor(
    @InjectRepository(InventoryClosure)
    private closureRepo: Repository<InventoryClosure>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<InventoryClosure[]> {
    return this.closureRepo.find({
      relations: ['warehouse'],
      order: { closure_date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<InventoryClosure> {
    return this.closureRepo.findOne({
      where: { id },
      relations: ['warehouse'],
    });
  }

  async create(warehouseId: number, notes?: string): Promise<InventoryClosure> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const reference = `CIERRE-${year}-${String(month).padStart(2, '0')}`;

    // Verificar si ya existe cierre para este período
    const existing = await this.closureRepo.findOne({
      where: { warehouse_id: warehouseId, period_month: month, period_year: year },
    });

    if (existing) {
      throw new Error('Ya existe un cierre para este período');
    }

    // Obtener snapshot del stock
    const snapshot = await this.dataSource.query(`
      SELECT 
        sm.product_id,
        p.sku,
        p.name,
        SUM(sm.quantity) as stock,
        p.price
      FROM stock_movements sm
      JOIN products p ON p.id = sm.product_id
      WHERE sm.warehouse_id = $1
      GROUP BY sm.product_id, p.sku, p.name, p.price
      HAVING SUM(sm.quantity) > 0
    `, [warehouseId]);

    const totalValue = snapshot.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.stock) * parseFloat(item.price || 0));
    }, 0);

    const closure = this.closureRepo.create({
      reference,
      warehouse_id: warehouseId,
      closure_date: now,
      period_month: month,
      period_year: year,
      total_value: totalValue,
      total_products: snapshot.length,
      notes,
      snapshot,
    });

    return this.closureRepo.save(closure);
  }
}
