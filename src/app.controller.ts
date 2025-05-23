    import { Controller, Post, Body } from '@nestjs/common';
    import { PasskeyService } from './app.service';
    import { ExternalIdDto } from './dto/externalId.dto';
    import { NonceDto } from './dto/nonce.dto';

    @Controller('passkey')
    export class PasskeyController {
      constructor(private readonly PasskeyService : PasskeyService) {}

      @Post('register-challenge')
      async createRegisterChallenge(@Body() dto: ExternalIdDto) {
        const { externalId } = dto;
        const response = await this.PasskeyService .createRegisterTransaction(externalId);
        return { transactionId: response }; // match frontend usage
      }

      @Post('authenticate-challenge')
      async createAuthenticateChallenge(@Body() dto: ExternalIdDto) {
        const { externalId } = dto;
        const response = await this.PasskeyService .createAuthenticateTransaction(externalId);
        return { transactionId: response };
      }

      @Post('verify')
      async verifyNonce(@Body() dto: NonceDto) {
        const { nonce } = dto;
        const result = await this.PasskeyService .verifyNonce(nonce);
        return { verified: result.verified };
      }
    } 
