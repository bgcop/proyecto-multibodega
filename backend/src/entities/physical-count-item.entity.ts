import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PhysicalCount } from './physical-count.entity';
import { Product } from './product.entity';

@Entity('physical_count_items')
export class PhysicalCountItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  count_id: number;

  @ManyToOne(() => PhysicalCount, { cascade: true })
  @JoinColumn({ name: 'count_id' })
  count: PhysicalCount;

  @Column()
  product_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int' })
  system_stock: number; // Stock según sistema

  @Column({ type: 'int' })
  physical_stock: number; // Stock contado físicamente

  @Column({ type: 'int' })
  difference: number; // physical_stock - system_stock

  @Column({ type: 'text', nullable: true })
  notes: string;
}
