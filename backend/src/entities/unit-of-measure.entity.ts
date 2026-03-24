import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('units_of_measure')
export class UnitOfMeasure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // KG, UN, LTR, MTR

  @Column()
  name: string; // Kilogramos, Unidades, Litros, Metros

  @Column({ nullable: true })
  symbol: string; // kg, un, l, m

  @CreateDateColumn()
  created_at: Date;
}
