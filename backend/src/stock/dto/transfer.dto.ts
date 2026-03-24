import { IsInt, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class TransferDto {
  @IsInt() @IsPositive()
  productId: number;

  @IsInt() @IsPositive()
  sourceWarehouseId: number;

  @IsInt() @IsPositive()
  targetWarehouseId: number;

  @IsInt() @IsPositive()
  quantity: number;

  @IsString() @IsNotEmpty()
  reason: string;
}
