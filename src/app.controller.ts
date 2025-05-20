import { Controller, Post, Body } from '@nestjs/common';
import { PasskeyService } from './app.service';
import {ExternalIdDto } from './dto/externalId.dto';
import { NonceDto } from './dto/nonce.dto'

@Controller('passkey')
export class PasskeyController {
  constructor(private readonly svc: PasskeyService) {}

  @Post('register-challenge')
  async register(@Body() dto: ExternalIdDto) {
    return this.svc.createRegisterChallenge(dto.externalId);
  }

  @Post('authenticate-challenge')
  async authenticate(@Body() dto: ExternalIdDto) {
    return this.svc.createAuthenticateChallenge(dto.externalId);
  }

  @Post('verify')
  async verify(@Body() dto: NonceDto) {
    return this.svc.verifyNonce(dto.nonce);
  }
}

