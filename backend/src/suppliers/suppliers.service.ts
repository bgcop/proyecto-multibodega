import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private repo: Repository<Supplier>,
  ) {}

  findAll(): Promise<Supplier[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findOne(id: number): Promise<Supplier> {
    return this.repo.findOne({ where: { id } }).then(s => {
      if (!s) throw new NotFoundException('Proveedor no encontrado');
      return s;
    });
  }

  create(data: Partial<Supplier>): Promise<Supplier> {
    const supplier = this.repo.create(data);
    return this.repo.save(supplier);
  }

  async update(id: number, data: Partial<Supplier>): Promise<Supplier> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
