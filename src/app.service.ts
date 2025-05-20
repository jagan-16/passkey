import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TokenService } from './Token.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasskeyService {
  constructor(
    private tokenService: TokenService,
    private configService: ConfigService
  ) {}

  private async getHeaders() {
    return {
      Authorization: `Bearer ${await this.tokenService.getToken()}`,
      'Content-Type': 'application/json'
    };
  }

  private buildUrl(endpoint: string): string {
    return `https://${this.configService.get('TENANT')}.${this.configService.get('REGION')}.authaction.com/api/v1/passkey-plus/${this.configService.get('APPLICATION_ID')}/${endpoint}`;
  }

  async createRegisterTransaction(externalId: string) {
    try {
      const response = await axios.post(
        this.buildUrl('transaction/register'),
        {
          external_id: externalId,
          passkey_display_name: 'My Device'
        },
        { headers: await this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create registration transaction');
    }
  }

  // Apply similar changes to other methods
  async createAuthenticateTransaction(externalId: string) {
    try {
      const response = await axios.post(
        this.buildUrl('transaction/authenticate'),
        { external_id: externalId },
        { headers: await this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create authentication transaction');
    }
  }

  async verifyNonce(nonce: string) {
    try {
      const response = await axios.post(
        this.buildUrl('authenticate/verify'),
        { nonce },
        { headers: await this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Nonce verification failed');
    }
  }
}