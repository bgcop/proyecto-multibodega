import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InventoryExit } from './inventory-exit.entity';
import { Product } from './product.entity';

@Entity('inventory_exit_items')
export class InventoryExitItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exit_id: number;

  @ManyToOne(() => InventoryExit, { cascade: true })
  @JoinColumn({ name: 'exit_id' })
  exit: InventoryExit;

  @Column()
  product_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;
}
