import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { StockMovement } from './stock-movement.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => StockMovement, stockMovement => stockMovement.sourceWarehouse)
  sourceMovements: StockMovement[];

  @OneToMany(() => StockMovement, stockMovement => stockMovement.targetWarehouse)
  targetMovements: StockMovement[];
}