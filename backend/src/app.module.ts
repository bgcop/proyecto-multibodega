import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { StockModule } from './stock/stock.module';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Category } from './entities/category.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Product } from './entities/product.entity';
import { StockMovement } from './entities/stock-movement.entity';

@Module({
  imports: [
    StockModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [
    StockModule,ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'multibodega'),
        entities: [User, Role, Category, Warehouse, Product, StockMovement],
        synchronize: configService.get<string>('NODE_ENV') === 'development', // Solo en desarrollo
        logging: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
