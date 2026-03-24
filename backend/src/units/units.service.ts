import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitOfMeasure } from '../entities/unit-of-measure.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(UnitOfMeasure)
    private repo: Repository<UnitOfMeasure>,
  ) {}

  findAll(): Promise<UnitOfMeasure[]> {
    return this.repo.find({ order: { code: 'ASC' } });
  }

  findOne(id: number): Promise<UnitOfMeasure> {
    return this.repo.findOne({ where: { id } }).then(u => {
      if (!u) throw new NotFoundException('Unidad no encontrada');
      return u;
    });
  }

  create(data: Partial<UnitOfMeasure>): Promise<UnitOfMeasure> {
    const unit = this.repo.create(data);
    return this.repo.save(unit);
  }

  async update(id: number, data: Partial<UnitOfMeasure>): Promise<UnitOfMeasure> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
