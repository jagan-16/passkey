import { Module } from '@nestjs/common';
import { PasskeyModule } from './passkey.module';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './Token.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // ✅ loads .env file
    }),
    PasskeyModule,
  ],
  providers: [TokenService]

})
export class AppModule {}
