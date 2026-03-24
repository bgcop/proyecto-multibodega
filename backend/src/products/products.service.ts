import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // Validate price non-negative (DTO already does, but double-check)
    if (createProductDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    // Check SKU uniqueness
    const existing = await this.productRepo.findOne({ where: { sku: createProductDto.sku } });
    if (existing) {
      throw new BadRequestException(`SKU '${createProductDto.sku}' already exists`);
    }

    // Validate category exists if provided
    let category = null;
    if (createProductDto.categoryId) {
      category = await this.categoryRepo.findOne({ where: { id: createProductDto.categoryId } });
      if (!category) {
        throw new BadRequestException(`Category with id ${createProductDto.categoryId} not found`);
      }
    }

    const product = this.productRepo.create({
      ...createProductDto,
    });
    if (category) {
      product.category = category;
    }

    return await this.productRepo.save(product);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.productRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category'],
      order: { id: 'ASC' },
    });
    return { 
      data, 
      total, 
      page, 
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({ 
      where: { id }, 
      relations: ['category'] 
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Validate price if provided
    if (updateProductDto.price !== undefined && updateProductDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    // Check SKU uniqueness if changed
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existing = await this.productRepo.findOne({ where: { sku: updateProductDto.sku } });
      if (existing) {
        throw new BadRequestException(`SKU '${updateProductDto.sku}' already exists`);
      }
    }

    // Validate category exists if provided
    let category = undefined;
    if (updateProductDto.categoryId !== undefined) {
      if (updateProductDto.categoryId === null) {
        category = null;
      } else {
        const found = await this.categoryRepo.findOne({ where: { id: updateProductDto.categoryId } });
        if (!found) {
          throw new BadRequestException(`Category with id ${updateProductDto.categoryId} not found`);
        }
        category = found;
      }
      product.category = category;
    }

    // Update other fields
    Object.assign(product, updateProductDto);

    return await this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Check if product has associated stock movements
    const hasMovements = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.stockMovements', 'stockMovements')
      .where('product.id = :id', { id })
      .andWhere('stockMovements.id IS NOT NULL')
      .getCount();

    if (hasMovements > 0) {
      throw new BadRequestException('Cannot delete product that has associated stock movements');
    }

    await this.productRepo.delete(id);
    return { message: `Product ${id} deleted successfully` };
  }
}
