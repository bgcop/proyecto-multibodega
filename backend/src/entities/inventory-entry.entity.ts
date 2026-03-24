import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Supplier } from './supplier.entity';

@Entity('inventory_entries')
export class InventoryEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  reference: string; // REC-2024-0001

  @Column()
  warehouse_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ nullable: true })
  supplier_id: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'date' })
  entry_date: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_value: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany('InventoryEntryItem', 'entry')
  items: any[];
}
