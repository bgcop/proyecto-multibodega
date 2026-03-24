import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Customer } from './customer.entity';

@Entity('inventory_exits')
export class InventoryExit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  reference: string; // SAL-2024-0001

  @Column()
  warehouse_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ nullable: true })
  customer_id: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'date' })
  exit_date: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_value: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany('InventoryExitItem', 'exit')
  items: any[];
}
