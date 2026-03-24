import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty()
  sku: string;

  @IsString() @IsNotEmpty()
  name: string;

  @IsNumber() @Min(0)
  price: number;

  @IsNumber() @Min(0)
  min_stock: number;
  
  @IsOptional() @IsNumber()
  category_id?: number;
}
