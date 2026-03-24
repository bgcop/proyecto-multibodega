import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntry } from '../entities/inventory-entry.entity';
import { InventoryEntryItem } from '../entities/inventory-entry-item.entity';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryEntry, InventoryEntryItem])],
  controllers: [EntriesController],
  providers: [EntriesService],
})
export class EntriesModule {}
