import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Entity('inventory_closures')
export class InventoryClosure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  reference: string; // CIERRE-2024-03

  @Column()
  warehouse_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ type: 'date' })
  closure_date: Date;

  @Column({ type: 'int' })
  period_month: number; // 1-12

  @Column({ type: 'int' })
  period_year: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_value: number;

  @Column({ type: 'int' })
  total_products: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  snapshot: any; // Snapshot del stock al momento del cierre

  @CreateDateColumn()
  created_at: Date;
}
