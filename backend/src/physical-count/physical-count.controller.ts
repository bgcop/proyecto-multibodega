import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { PhysicalCountService } from './physical-count.service';
import { PhysicalCount } from '../entities/physical-count.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/physical-counts')
export class PhysicalCountController {
  constructor(private readonly service: PhysicalCountService) {}

  @Get()
  findAll(): Promise<PhysicalCount[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PhysicalCount> {
    return this.service.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body('warehouse_id') warehouseId: number): Promise<PhysicalCount> {
    return this.service.create(warehouseId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/items/:itemId')
  updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: { physical_stock: number; notes?: string },
  ): Promise<any> {
    return this.service.updateItem(+id, +itemId, body.physical_stock, body.notes);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/complete')
  complete(@Param('id') id: string): Promise<PhysicalCount> {
    return this.service.complete(+id);
  }
}
