import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly repo: Repository<Category>) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existing = await this.repo.findOne({ where: { name: createCategoryDto.name } });
    if (existing) {
      throw new BadRequestException(`Category '${createCategoryDto.name}' already exists`);
    }

    const category = this.repo.create(createCategoryDto);

    if (createCategoryDto.parentId) {
      const parent = await this.repo.findOne({ where: { id: createCategoryDto.parentId } });
      if (!parent) {
        throw new BadRequestException(`Parent category with id ${createCategoryDto.parentId} not found`);
      }
      category.parent = parent;
    }

    return await this.repo.save(category);
  }

  async findAll() {
    return await this.repo.find({
      relations: ['parent', 'children'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const category = await this.repo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    // Check for duplicate name (excluding current category)
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existing = await this.repo.findOne({ where: { name: updateCategoryDto.name } });
      if (existing) {
        throw new BadRequestException(`Category name '${updateCategoryDto.name}' is already taken`);
      }
    }

    // Update parent if provided
    if (updateCategoryDto.parentId !== undefined) {
      if (updateCategoryDto.parentId === null) {
        category.parent = null as any;
      } else if (updateCategoryDto.parentId !== category.parent?.id) {
        const parent = await this.repo.findOne({ where: { id: updateCategoryDto.parentId } });
        if (!parent) {
          throw new BadRequestException(`Parent category with id ${updateCategoryDto.parentId} not found`);
        }
        // Prevent circular reference (a category cannot be its own parent/ancestor)
        if (await this.isDescendant(parent.id, id)) {
          throw new BadRequestException('Circular reference detected: a category cannot be a descendant of itself');
        }
        category.parent = parent;
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.repo.save(category);
  }

  async remove(id: number) {
    const category = await this.repo.findOne({
      where: { id },
      relations: ['children'],
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    // Check if category has children
    if (category.children && category.children.length > 0) {
      throw new BadRequestException('Cannot delete category that has subcategories');
    }

    await this.repo.delete(id);
    return { message: `Category ${id} deleted successfully` };
  }

  private async isDescendant(parentId: number, childId: number): Promise<boolean> {
    if (parentId === childId) return true;
    const parent = await this.repo.findOne({
      where: { id: parentId },
      relations: ['children'],
    });
    if (!parent || !parent.children) return false;
    for (const child of parent.children) {
      if (child.id === childId) return true;
      if (await this.isDescendant(child.id, childId)) return true;
    }
    return false;
  }
}
