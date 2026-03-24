import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhysicalCount } from '../entities/physical-count.entity';
import { PhysicalCountItem } from '../entities/physical-count-item.entity';
import { PhysicalCountController } from './physical-count.controller';
import { PhysicalCountService } from './physical-count.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhysicalCount, PhysicalCountItem])],
  controllers: [PhysicalCountController],
  providers: [PhysicalCountService],
})
export class PhysicalCountModule {}
