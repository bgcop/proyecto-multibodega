import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockMovement } from '../entities/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovement])],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}
