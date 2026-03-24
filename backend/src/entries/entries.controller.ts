import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { InventoryEntry } from '../entities/inventory-entry.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/entries')
export class EntriesController {
  constructor(private readonly service: EntriesService) {}

  @Get()
  findAll(): Promise<InventoryEntry[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<InventoryEntry> {
    return this.service.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: any): Promise<InventoryEntry> {
    return this.service.create(data);
  }
}
