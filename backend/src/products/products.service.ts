import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async create(createConfig: CreateProductDto) {
    if (createConfig.price < 0) throw new BadRequestException('Precío no puede ser negativo');
    const existing = await this.repo.findOne({ where: { sku: createConfig.sku } });
    if (existing) throw new BadRequestException(`SKU devuelto duplicado ${createConfig.sku}`);
    
    // Asumimos validacion de categoria ID en dto, guardamos base
    const p = this.repo.create(createConfig as any);
    return await this.repo.save(p);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category']
    });
    return { data, total, page, last_page: Math.ceil(total/limit) };
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id }, relations:['category'] });
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
