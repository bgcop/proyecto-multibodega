import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InventoryEntry } from './inventory-entry.entity';
import { Product } from './product.entity';

@Entity('inventory_entry_items')
export class InventoryEntryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entry_id: number;

  @ManyToOne(() => InventoryEntry, { cascade: true })
  @JoinColumn({ name: 'entry_id' })
  entry: InventoryEntry;

  @Column()
  product_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_cost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;
}
