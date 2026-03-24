import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';
import { User } from './user.entity';

export enum StockMovementType {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER = 'TRANSFER',
}

@Entity('stock_movements')
@Index(['productId', 'date'])
@Index(['sourceWarehouseId', 'date'])
@Index(['targetWarehouseId', 'date'])
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StockMovementType,
  })
  type: StockMovementType;

  @Column('decimal', { precision: 10, scale: 3 })
  quantity: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, product => product.stockMovements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'source_warehouse_id', nullable: true })
  sourceWarehouseId: number;

  @ManyToOne(() => Warehouse, warehouse => warehouse.sourceMovements, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'source_warehouse_id' })
  sourceWarehouse: Warehouse;

  @Column({ name: 'target_warehouse_id', nullable: true })
  targetWarehouseId: number;

  @ManyToOne(() => Warehouse, warehouse => warehouse.targetMovements, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'target_warehouse_id' })
  targetWarehouse: Warehouse;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, user => user.stockMovements, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}