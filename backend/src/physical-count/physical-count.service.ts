import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PhysicalCount } from '../entities/physical-count.entity';
import { PhysicalCountItem } from '../entities/physical-count-item.entity';

@Injectable()
export class PhysicalCountService {
  constructor(
    @InjectRepository(PhysicalCount)
    private countRepo: Repository<PhysicalCount>,
    @InjectRepository(PhysicalCountItem)
    private itemRepo: Repository<PhysicalCountItem>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<PhysicalCount[]> {
    return this.countRepo.find({
      relations: ['warehouse', 'items', 'items.product'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PhysicalCount> {
    return this.countRepo.findOne({
      where: { id },
      relations: ['warehouse', 'items', 'items.product'],
    });
  }

  async create(warehouseId: number): Promise<PhysicalCount> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generar referencia
      const count = await queryRunner.manager.count(PhysicalCount);
      const reference = `CONTEO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

      // Crear conteo
      const physicalCount = queryRunner.manager.create(PhysicalCount, {
        reference,
        warehouse_id: warehouseId,
        count_date: new Date(),
        status: 'IN_PROGRESS',
      });
      
      await queryRunner.manager.save(physicalCount);

      // Obtener stock actual de la bodega
      const stockItems = await queryRunner.query(`
        SELECT 
          sm.product_id,
          SUM(sm.quantity) as stock,
          p.name as product_name,
          p.sku
        FROM stock_movements sm
        JOIN products p ON p.id = sm.product_id
        WHERE sm.warehouse_id = $1
        GROUP BY sm.product_id, p.name, p.sku
        HAVING SUM(sm.quantity) > 0
      `, [warehouseId]);

      // Crear items del conteo
      for (const item of stockItems) {
        const countItem = queryRunner.manager.create(PhysicalCountItem, {
          count_id: physicalCount.id,
          product_id: item.product_id,
          system_stock: parseInt(item.stock),
          physical_stock: 0, // Por llenar
          difference: -parseInt(item.stock),
        });
        await queryRunner.manager.save(countItem);
      }

      physicalCount.total_items = stockItems.length;
      await queryRunner.manager.save(physicalCount);

      await queryRunner.commitTransaction();
      return this.findOne(physicalCount.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateItem(countId: number, itemId: number, physicalStock: number, notes?: string): Promise<PhysicalCountItem> {
    const item = await this.itemRepo.findOne({ where: { id: itemId, count_id: countId } });
    if (!item) throw new Error('Item no encontrado');

    item.physical_stock = physicalStock;
    item.difference = physicalStock - item.system_stock;
    if (notes) item.notes = notes;

    await this.itemRepo.save(item);
    return item;
  }

  async complete(id: number): Promise<PhysicalCount> {
    const count = await this.findOne(id);
    if (!count) throw new Error('Conteo no encontrado');

    let matched = 0;
    let mismatched = 0;

    for (const item of count.items) {
      if (item.difference === 0) {
        matched++;
      } else {
        mismatched++;
      }
    }

    count.matched_items = matched;
    count.mismatched_items = mismatched;
    count.status = 'COMPLETED';

    await this.countRepo.save(count);
    return count;
  }
}
