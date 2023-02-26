import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  Headers,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './_dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('users/:user_id')
  async fetchUser(
    @Param('user_id') user_id: string,
    @Res() res: Response,
    @Headers() headers,
  ) {
    const auth = headers?.Authorization || headers?.authorization;

    if (!auth) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Authentication Failed',
      });
    }

    const authedUser = await this.appService.authedUser(auth);

    if (authedUser?.id) {
      const user = await this.appService.fetchUser(user_id);
      if (user === 404)
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'No User Found',
        });

      return res.status(HttpStatus.OK).send(user);
    }

    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'Authentication Failed',
    });
  }

  @Post('signup')
  @HttpCode(200)
  async createUserAccount(
    @Body() payload: CreateUserDto,
    @Res() res: Response,
  ) {
    const response = await this.appService.createUserAccount(payload);

    if (response === 400)
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Account creation failed',
        cause: 'already same user_id is used',
      });

    return res.status(HttpStatus.OK).send(response);
  }

  @Patch('users/:user_id')
  patchUserAccount() {
    return 'sasa';
  }

  @Post('close')
  async deleteUserAccount(@Headers() headers, @Res() res: Response) {
    const auth = headers?.Authorization || headers?.authorization;

    if (!auth) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Authentication Failed',
      });
    }

    const authedUser = await this.appService.authedUser(auth);

    if (authedUser?.id) {
      const user = await this.appService.deleteUserAccount(authedUser);
      if (user?.id) {
        return res.status(HttpStatus.OK).send({
          message: 'Account and user successfully removed',
        });
      }
      return res.status(HttpStatus.NO_CONTENT).send();
    }

    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'Authentication Failed',
    });
  }
}
