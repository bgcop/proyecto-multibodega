import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Entity('physical_counts')
export class PhysicalCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  reference: string; // CONTEO-2024-0001

  @Column()
  warehouse_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ type: 'date' })
  count_date: Date;

  @Column({ default: 'IN_PROGRESS' })
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'int', default: 0 })
  total_items: number;

  @Column({ type: 'int', default: 0 })
  matched_items: number;

  @Column({ type: 'int', default: 0 })
  mismatched_items: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany('PhysicalCountItem', 'count')
  items: any[];
}
