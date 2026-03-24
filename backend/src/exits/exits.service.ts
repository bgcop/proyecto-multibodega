import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventoryExit } from '../entities/inventory-exit.entity';
import { InventoryExitItem } from '../entities/inventory-exit-item.entity';

@Injectable()
export class ExitsService {
  constructor(
    @InjectRepository(InventoryExit)
    private exitRepo: Repository<InventoryExit>,
    @InjectRepository(InventoryExitItem)
    private itemRepo: Repository<InventoryExitItem>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<InventoryExit[]> {
    return this.exitRepo.find({
      relations: ['warehouse', 'customer', 'items', 'items.product'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<InventoryExit> {
    return this.exitRepo.findOne({
      where: { id },
      relations: ['warehouse', 'customer', 'items', 'items.product'],
    });
  }

  async create(data: any): Promise<InventoryExit> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generar referencia
      const count = await queryRunner.manager.count(InventoryExit);
      const reference = `SAL-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

      // Validar stock disponible
      for (const item of data.items) {
        const stockResult = await queryRunner.query(
          `SELECT COALESCE(SUM(quantity), 0) as stock FROM stock_movements 
           WHERE product_id = $1 AND warehouse_id = $2`,
          [item.product_id, data.warehouse_id]
        );
        const currentStock = parseInt(stockResult[0]?.stock || 0);
        
        if (currentStock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para producto ${item.product_id}. Disponible: ${currentStock}, Solicitado: ${item.quantity}`
          );
        }
      }

      // Crear salida
      const exit = queryRunner.manager.create(InventoryExit, {
        reference,
        warehouse_id: data.warehouse_id,
        customer_id: data.customer_id,
        exit_date: data.exit_date || new Date(),
        notes: data.notes,
        status: 'COMPLETED',
        total_value: data.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0),
      });
      
      await queryRunner.manager.save(exit);

      // Crear items y actualizar stock
      for (const item of data.items) {
        const exitItem = queryRunner.manager.create(InventoryExitItem, {
          exit_id: exit.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.quantity * item.unit_price,
        });
        await queryRunner.manager.save(exitItem);

        // Actualizar stock (INSERT OUT negativo)
        await queryRunner.query(
          `INSERT INTO stock_movements (product_id, warehouse_id, quantity, movement_type, reference, created_at)
           VALUES ($1, $2, $3, 'OUT', $4, NOW())`,
          [item.product_id, data.warehouse_id, -item.quantity, reference]
        );
      }

      await queryRunner.commitTransaction();
      return this.findOne(exit.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
