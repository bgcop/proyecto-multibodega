import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { ProductsController } from './products.controller';
import { WarehousesController } from './warehouses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Warehouse])],
  controllers: [ProductsController, WarehousesController]
})
export class CatalogModule {}
