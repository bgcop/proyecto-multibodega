import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

export enum RoleName {
  ADMIN = 'Admin',
  WAREHOUSE_MANAGER = 'Warehouse_Manager',
  VIEWER = 'Viewer',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleName,
    default: RoleName.VIEWER,
  })
  name: RoleName;

  @Column('simple-array', { nullable: true })
  permissions: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => User, user => user.role)
  users: User[];
}