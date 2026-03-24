import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER = 'TRANSFER',
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  // Garantiza que nadie introduzca cantidad en falso (se tratará el Type como suma/resta posterior)
  @Column({ type: 'int' })
  quantity: number;

  @Column({ nullable: true })
  reason: string;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Warehouse, { nullable: true }) // Puede ser un ingreso Foraneo sin origen
  @JoinColumn({ name: 'source_warehouse_id' })
  source_warehouse: Warehouse;

  @ManyToOne(() => Warehouse, { nullable: true }) // Puede ser una Salida directa y sin destino
  @JoinColumn({ name: 'target_warehouse_id' })
  target_warehouse: Warehouse;

  /* IMPORTANTE: Aqui iria el "user_id" si inyectamos Auth.  */
  @Column({ nullable: true })
  user_id: number;
}
