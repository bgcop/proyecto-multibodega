import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly repo: Repository<Category>) {}

  async create(body: any) {
    const existing = await this.repo.findOne({ where: { name: body.name } });
    if (existing) throw new BadRequestException(`Category ${body.name} duplicada`);
    
    const cat = this.repo.create(body as Object);
    return await this.repo.save(cat);
  }

  async findAll() {
    return await this.repo.find({ relations: ['subcategories'] });
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
