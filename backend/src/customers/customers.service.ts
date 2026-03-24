import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private repo: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findOne(id: number): Promise<Customer> {
    return this.repo.findOne({ where: { id } }).then(c => {
      if (!c) throw new NotFoundException('Cliente no encontrado');
      return c;
    });
  }

  create(data: Partial<Customer>): Promise<Customer> {
    const customer = this.repo.create(data);
    return this.repo.save(customer);
  }

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
