import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitOfMeasure } from '../entities/unit-of-measure.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/units')
export class UnitsController {
  constructor(private readonly service: UnitsService) {}

  @Get()
  findAll(): Promise<UnitOfMeasure[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UnitOfMeasure> {
    return this.service.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: Partial<UnitOfMeasure>): Promise<UnitOfMeasure> {
    return this.service.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<UnitOfMeasure>): Promise<UnitOfMeasure> {
    return this.service.update(+id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}
