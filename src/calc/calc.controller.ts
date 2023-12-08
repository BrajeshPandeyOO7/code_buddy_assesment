import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { CalcService } from './calc.service';
import { CalcDto } from './calc.dto';

@Controller('calc')
export class CalcController {
  constructor(private readonly calcService: CalcService) {}

  @Post('/')
  calc(@Body() calcBody: CalcDto) {
    const result = this.calcService.calculateExpression(calcBody);
    if (!result) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid expression provided',
        error: 'Bad Request',
      });
    }
    return {
      result,
    };
  }
}
