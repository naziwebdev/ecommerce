import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CreateCheckoutDto } from './dtos/create-checkout.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('checkouts')
export class CheckoutsController {
  constructor(private readonly checkoutsService: CheckoutsService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createCheckout(
    @GetUser() user: User,
    @Body() body: CreateCheckoutDto,
    @Res() res: Response,
  ) {
    const peymentURL = await this.checkoutsService.createCheckout(
      user,
      body.addressId,
    );
    return res.status(HttpStatus.CREATED).json({
      data: peymentURL,
      statusCode: HttpStatus.CREATED,
      message: 'checkout created successfully',
    });
  }
  @Get('/verify')
  async verifyCheckout(
    @Query('Authority') Authority: string,
    @Res() res: Response,
  ) {
    const paymentResult = await this.checkoutsService.verifyCheckout(
      Authority,
    );
    return res.status(HttpStatus.OK).json({
      data: paymentResult,
      statusCode: HttpStatus.OK,
      message: 'checkout verified successfully',
    });
  }
}
