import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WarehousesService } from './warehouses.service';

@Controller('api/warehouses')
@UseGuards(AuthGuard('jwt')) 
export class WarehousesController {
  constructor(private readonly wService: WarehousesService) {}
  @Post() create(@Body() dto: any) { return this.wService.create(dto); }
  @Get() findAll() { return this.wService.findAll(); }
  @Delete(':id') remove(@Param('id') id: string) { return this.wService.remove(+id); }
}
