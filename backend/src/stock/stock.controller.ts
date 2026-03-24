import { Controller, Post, Body, Get, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { StockService } from './stock.service';
import { TransferDto } from './dto/transfer.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/stock-movements')
@UseGuards(AuthGuard('jwt'))
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('transfer')
  async transferStock(@Body() transferDto: TransferDto, @Req() req: any) {
    // Si queremos restringir roles: if (req.user.role.name === 'viewer') throw ForbiddenException()
    try {
      return await this.stockService.executeTransfer(
        transferDto.productId,
        transferDto.sourceWarehouseId,
        transferDto.targetWarehouseId,
        transferDto.quantity,
        transferDto.reason,
        req.user.id // Trazabilidad real anexada al modelo SQL
      );
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('low-warnings')
  getLowWarnings() {
    return this.stockService.getLowStockWarnings();
  }
}
