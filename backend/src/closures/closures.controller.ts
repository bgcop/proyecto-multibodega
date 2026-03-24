import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ClosuresService } from './closures.service';
import { InventoryClosure } from '../entities/inventory-closure.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/closures')
export class ClosuresController {
  constructor(private readonly service: ClosuresService) {}

  @Get()
  findAll(): Promise<InventoryClosure[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<InventoryClosure> {
    return this.service.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: { warehouse_id: number; notes?: string }): Promise<InventoryClosure> {
    return this.service.create(body.warehouse_id, body.notes);
  }
}
