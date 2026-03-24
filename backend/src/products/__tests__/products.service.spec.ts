import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { BadRequestException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repoSpy: any;

  beforeEach(async () => {
    repoSpy = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: repoSpy },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('Debe abortar creacion de producto con precio negativo', async () => {
    await expect(service.create({ sku: '123', name: 'Error', price: -5, min_stock: 0 })).rejects.toThrow(BadRequestException);
  });

  it('Debe abortar creacion si el SKU ya existe', async () => {
    repoSpy.findOne.mockResolvedValue({ id: 1, sku: 'DUPLICATE' });
    await expect(service.create({ sku: 'DUPLICATE', name: 'Test', price: 100, min_stock: 1 })).rejects.toThrow(BadRequestException);
  });
  
  it('Debe crear el producto exitosamente', async () => {
    repoSpy.findOne.mockResolvedValue(null);
    repoSpy.create.mockReturnValue({ sku: 'NEW' });
    repoSpy.save.mockResolvedValue({ id: 2, sku: 'NEW' });
    
    const result = await service.create({ sku: 'NEW', name: 'Test', price: 100, min_stock: 1 });
    expect(result.id).toBe(2);
  });
});
