import { IsArray, IsNumber, IsNotEmpty, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];
}
