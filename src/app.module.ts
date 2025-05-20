import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './Token.service';
import { PasskeyService } from './app.service';
import { PasskeyController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [PasskeyController],
  providers: [
    TokenService,
    PasskeyService,
    ConfigService, // Add this
  ],
})
export class AppModule {}