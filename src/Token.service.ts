// src/token/token.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private accessToken: string;
  private tokenExpiresAt: number;
  private tokenFetchPromise: Promise<void> | null = null;

  constructor(private configService: ConfigService) {
    // Start initial token fetch but don't wait for it
    this.fetchAccessToken().catch(error => {
      console.error('Initial token fetch failed:', error.message);
    });
  }

  private async fetchAccessToken() {
    // Prevent concurrent token fetches
    if (this.tokenFetchPromise) return this.tokenFetchPromise;

    this.tokenFetchPromise = (async () => {
      const url = this.configService.get('AUTH_TOKEN_URL');
      const data = {
        grant_type: 'client_credentials',
        client_id: this.configService.get('AUTH_CLIENT_ID'),
        client_secret: this.configService.get('AUTH_CLIENT_SECRET'),
        audience: this.configService.get('AUTH_AUDIENCE'),
      };

      try {
        const response = await axios.post(url, data, {
          headers: { 'Content-Type': 'application/json' },
        });

        this.accessToken = response.data.access_token;
        const expiresIn = response.data.expires_in || 3600;
        this.tokenExpiresAt = Date.now() + expiresIn * 1000;

        console.log(`Token refreshed. Expires at ${new Date(this.tokenExpiresAt).toISOString()}`);
      } catch (error) {
        console.error('Token refresh failed:', error.message);
        throw error;
      } finally {
        this.tokenFetchPromise = null;
      }
    })();

    return this.tokenFetchPromise;
  }

  private isTokenValid(): boolean {
    return !!this.accessToken && Date.now() < this.tokenExpiresAt;
  }

  async getToken(): Promise<string> {
    if (!this.isTokenValid()) {
      await this.fetchAccessToken();
    }
    return this.accessToken;
  }
}