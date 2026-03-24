import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryClosure } from '../entities/inventory-closure.entity';
import { ClosuresController } from './closures.controller';
import { ClosuresService } from './closures.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryClosure])],
  controllers: [ClosuresController],
  providers: [ClosuresService],
})
export class ClosuresModule {}
