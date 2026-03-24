import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { StockService } from './stock.service';
import { TransferDto } from './dto/transfer.dto';

@Controller('api/stock-movements')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('transfer')
  async transferStock(@Body() transferDto: TransferDto) {
    try {
      return await this.stockService.executeTransfer(
        transferDto.productId,
        transferDto.sourceWarehouseId,
        transferDto.targetWarehouseId,
        transferDto.quantity,
        transferDto.reason
      );
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }
}
