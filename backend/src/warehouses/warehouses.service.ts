import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(@InjectRepository(Warehouse) private readonly repo: Repository<Warehouse>) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    const existing = await this.repo.findOne({ where: { code: createWarehouseDto.code } });
    if (existing) {
      throw new BadRequestException(`Warehouse with code '${createWarehouseDto.code}' already exists`);
    }

    const warehouse = this.repo.create(createWarehouseDto);
    return await this.repo.save(warehouse);
  }

  async findAll() {
    return await this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const warehouse = await this.repo.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id ${id} not found`);
    }
    return warehouse;
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    const warehouse = await this.repo.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id ${id} not found`);
    }

    // Check for duplicate code (excluding current warehouse)
    if (updateWarehouseDto.code && updateWarehouseDto.code !== warehouse.code) {
      const existing = await this.repo.findOne({ where: { code: updateWarehouseDto.code } });
      if (existing) {
        throw new BadRequestException(`Warehouse code '${updateWarehouseDto.code}' is already taken`);
      }
    }

    Object.assign(warehouse, updateWarehouseDto);
    return await this.repo.save(warehouse);
  }

  async remove(id: number) {
    const warehouse = await this.repo.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id ${id} not found`);
    }

    // Check if warehouse has associated stock movements
    const hasMovements = await this.repo
      .createQueryBuilder('warehouse')
      .leftJoin('warehouse.sourceMovements', 'sourceMovements')
      .leftJoin('warehouse.targetMovements', 'targetMovements')
      .where('warehouse.id = :id', { id })
      .andWhere('(sourceMovements.id IS NOT NULL OR targetMovements.id IS NOT NULL)')
      .getCount();

    if (hasMovements > 0) {
      throw new BadRequestException('Cannot delete warehouse that has associated stock movements');
    }

    await this.repo.delete(id);
    return { message: `Warehouse ${id} deleted successfully` };
  }
}
