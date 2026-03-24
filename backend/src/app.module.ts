import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StockModule } from './stock/stock.module';
import { UnitsModule } from './units/units.module';
import { CustomersModule } from './customers/customers.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { EntriesModule } from './entries/entries.module';
import { ExitsModule } from './exits/exits.module';
import { PhysicalCountModule } from './physical-count/physical-count.module';
import { ClosuresModule } from './closures/closures.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'multibodega',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    StockModule,
    UnitsModule,
    CustomersModule,
    SuppliersModule,
    EntriesModule,
    ExitsModule,
    PhysicalCountModule,
    ClosuresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
