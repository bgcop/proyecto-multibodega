import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';

@Controller('api/categories')
@UseGuards(AuthGuard('jwt')) 
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post() create(@Body() b: any) { return this.categoriesService.create(b); }
  @Get() findAll() { return this.categoriesService.findAll(); }
  @Delete(':id') remove(@Param('id') id: string) { return this.categoriesService.remove(+id); }
}
