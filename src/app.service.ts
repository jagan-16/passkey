// src/passage/passage.service.ts
import { Injectable  } from '@nestjs/common';
import { TokenService } from './Token.service'
import axios from 'axios';

@Injectable()
export class PasskeyService  {
  constructor(private tokenService: TokenService) {}

  private get headers() {
    return {
      Authorization: `Bearer ${this.tokenService.getToken()}`,
      'Content-Type': 'application/json'
    };
  }

  async createRegisterTransaction(externalId: string) {
    const url = `https://{tenant}.{region}.authaction.com/api/v1/passkey-plus/{applicationId}/transaction/register`;

    const response = await axios.post(url, {
      external_id: externalId,
      passkey_display_name: 'My Device'
    }, { headers: this.headers });

    return response.data;
  }

  async createAuthenticateTransaction(externalId: string) {
    const url = `https://{tenant}.{region}.authaction.com/api/v1/passkey-plus/{applicationId}/transaction/authenticate`;

    const response = await axios.post(url, {
      external_id: externalId
    }, { headers: this.headers });

    return response.data;
  }

  async verifyNonce(nonce: string) {
    const url = `https://{tenant}.{region}.authaction.com/api/v1/passkey-plus/{applicationId}/authenticate/verify
`;

    const response = await axios.post(url, {
      nonce: nonce
    }, { headers: this.headers });

    return response.data;
  }
}
