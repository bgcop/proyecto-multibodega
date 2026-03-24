import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'usuario',    // Cambiar por auth global DBA
      password: 'password',   // Cambiar por auth global DBA
      database: 'multibodega',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Sync para Dev: Reemplaza esquemas auto
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
