import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/warehouse.dto';

@Controller('api/warehouses')
@UseGuards(AuthGuard('jwt'))
export class WarehousesController {
  constructor(
    @InjectRepository(Warehouse) private whRepo: Repository<Warehouse>
  ) {}

  @Get()
  async getAll() {
    return this.whRepo.find();
  }

  @Post()
  async create(@Body() dto: CreateWarehouseDto) {
      return await this.whRepo.save(this.whRepo.create(dto));
  }
}
