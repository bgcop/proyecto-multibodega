import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryExit } from '../entities/inventory-exit.entity';
import { InventoryExitItem } from '../entities/inventory-exit-item.entity';
import { ExitsController } from './exits.controller';
import { ExitsService } from './exits.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryExit, InventoryExitItem])],
  controllers: [ExitsController],
  providers: [ExitsService],
})
export class ExitsModule {}
