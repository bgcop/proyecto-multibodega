import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventoryEntry } from '../entities/inventory-entry.entity';
import { InventoryEntryItem } from '../entities/inventory-entry-item.entity';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(InventoryEntry)
    private entryRepo: Repository<InventoryEntry>,
    @InjectRepository(InventoryEntryItem)
    private itemRepo: Repository<InventoryEntryItem>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<InventoryEntry[]> {
    return this.entryRepo.find({
      relations: ['warehouse', 'supplier', 'items', 'items.product'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<InventoryEntry> {
    return this.entryRepo.findOne({
      where: { id },
      relations: ['warehouse', 'supplier', 'items', 'items.product'],
    });
  }

  async create(data: any): Promise<InventoryEntry> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generar referencia
      const count = await queryRunner.manager.count(InventoryEntry);
      const reference = `REC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

      // Crear entrada
      const entry = queryRunner.manager.create(InventoryEntry, {
        reference,
        warehouse_id: data.warehouse_id,
        supplier_id: data.supplier_id,
        entry_date: data.entry_date || new Date(),
        notes: data.notes,
        status: 'COMPLETED',
        total_value: data.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_cost), 0),
      });
      
      await queryRunner.manager.save(entry);

      // Crear items y actualizar stock
      for (const item of data.items) {
        const entryItem = queryRunner.manager.create(InventoryEntryItem, {
          entry_id: entry.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_cost: item.unit_cost,
          subtotal: item.quantity * item.unit_cost,
        });
        await queryRunner.manager.save(entryItem);

        // Actualizar stock (INSERT IN)
        await queryRunner.query(
          `INSERT INTO stock_movements (product_id, warehouse_id, quantity, movement_type, reference, created_at)
           VALUES ($1, $2, $3, 'IN', $4, NOW())`,
          [item.product_id, data.warehouse_id, item.quantity, reference]
        );
      }

      await queryRunner.commitTransaction();
      return this.findOne(entry.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error al crear entrada: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
