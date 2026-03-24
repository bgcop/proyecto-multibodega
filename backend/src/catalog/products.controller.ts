import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/product.dto';

@Controller('api/products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>
  ) {}

  @Get()
  async getAll() {
    return this.productRepo.find({ relations: ['category'] });
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    try {
      const p = this.productRepo.create(dto);
      // Aqui asiganariamos la category manualmente en base al ID
      return await this.productRepo.save(p);
    } catch(e) {
      throw new HttpException("Error UNIQUE SKU / Data", 400); // Failsafe PG Code
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productRepo.delete(id);
    return { success: true };
  }
}
