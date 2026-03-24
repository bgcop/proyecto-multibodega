import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExitsService } from './exits.service';
import { InventoryExit } from '../entities/inventory-exit.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/exits')
export class ExitsController {
  constructor(private readonly service: ExitsService) {}

  @Get()
  findAll(): Promise<InventoryExit[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<InventoryExit> {
    return this.service.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: any): Promise<InventoryExit> {
    return this.service.create(data);
  }
}
