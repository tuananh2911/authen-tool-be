import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SignInDto } from './dtos/sign-in.dto';
import { AccessToolDto } from './dtos/access-tool.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('authentication')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('sign-in')
  signIn(@Body() data: SignInDto) {
    return this.appService.author(data);
  }
  @Post('access-tool')
  accessTool(@Body() code: AccessToolDto) {
    return this.appService.accessTool(code);
  }
  @Post('sign-up')
  signUp(@Body() data: SignUpDto) {
    return this.appService.createUser(data);
  }
}
