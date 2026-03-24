import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { StockService } from '../stock.service';
import { BadRequestException } from '@nestjs/common';

// Tests de Integracion Core del Modelo de Traspaso (Mocks)
describe('StockService (Isolation Unit)', () => {
  let service: StockService;
  let dataSource: any;

  beforeEach(async () => {
    // Mock QueryRunner 
    const queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn().mockResolvedValue({ id: 1 }), // Mockea P, W_A, W_B exitos
        save: jest.fn().mockResolvedValue({ id: 999 })
      }
    };

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
      manager: {
        find: jest.fn().mockResolvedValue([]) // Stock 0 de base
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
  });

  it('debe abortar si el stock actual en Bodega de origen es Cero O Menor a QTY', async () => {
    // Override de GetStock para fingir un falso (hay solo 5 y pido 20)
    jest.spyOn(service, 'getStock').mockResolvedValue(5); 

    await expect(service.executeTransfer(1, 1, 2, 20, 'Venta', 1)).rejects.toThrow('Stock insuficiente');
  });

  it('debe abortar transferencia hacia si misma (Bucle bodegas)', async () => {
    await expect(service.executeTransfer(1, 4, 4, 10, 'Error', 1)).rejects.toThrow(BadRequestException);
  });
});
