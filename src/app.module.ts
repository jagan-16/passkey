import { Module } from '@nestjs/common';
import { PasskeyModule } from './passkey.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PasskeyModule
    , ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],

})
export class AppModule {}
