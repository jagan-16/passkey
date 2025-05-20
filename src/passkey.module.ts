  import { Module } from '@nestjs/common';
  import { PasskeyService } from './app.service';
  import { PasskeyController } from './app.controller';

  @Module({
    providers: [PasskeyService],
    controllers: [PasskeyController],
  })
  export class PasskeyModule {}
