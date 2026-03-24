import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty() sku: string;
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() description?: string;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) min_stock: number;
  @IsString() @IsOptional() image_url?: string;
  @IsNumber() @IsOptional() category_id?: number;
}
