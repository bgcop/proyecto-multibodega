import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';

@Injectable()
export class WarehousesService {
  constructor(@InjectRepository(Warehouse) private readonly repo: Repository<Warehouse>) {}

  async create(body: any) {
    const existing = await this.repo.findOne({ where: { code: body.code } });
    if (existing) throw new BadRequestException(`Bodega ${body.code} duplicada`);
    
    const w = this.repo.create(body as Object);
    return await this.repo.save(w);
  }

  async findAll() {
    return await this.repo.find();
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
