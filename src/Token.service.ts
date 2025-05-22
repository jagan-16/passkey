// src/token/token.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private tokenFetchPromise: Promise<void> | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 5000; // 5 seconds

  constructor(private configService: ConfigService) {
    this.initializeToken().catch((err) => 
      this.logger.error(`Initial token fetch failed: ${err.message}`)
    );
  }

  private async initializeToken(): Promise<void> {
    try {
      await this.fetchAccessToken();
    } catch (error) {
      this.logger.error(`Initial token fetch failed: ${this.formatError(error)}`);
    }
  }

  private async fetchAccessToken(): Promise<void> {
    if (this.tokenFetchPromise) return this.tokenFetchPromise;

    this.tokenFetchPromise = (async () => {
      let attempts = 0;
      while (attempts < this.MAX_RETRIES) {
        try {
          const url = this.configService.get('AUTH_TOKEN_URL');
          const data = {
            grant_type: 'client_credentials',
            client_id: this.configService.get('AUTH_CLIENT_ID'),
            client_secret: this.configService.get('AUTH_CLIENT_SECRET'),
            audience: this.configService.get('AUTH_AUDIENCE'),
          };

          const response = await axios.post(url, data, {
            headers: { 'Content-Type': 'application/json' },
          });

          this.accessToken = response.data.access_token;
          const expiresIn = response.data.expires_in || 3600;
          this.tokenExpiresAt = Date.now() + expiresIn * 1000;
          
          this.logger.log(`Token refreshed. Expires at ${new Date(this.tokenExpiresAt).toISOString()}`);
          return;
        } catch (error) {
          attempts++;
          this.accessToken = null;
          this.tokenExpiresAt = 0;

          if (attempts >= this.MAX_RETRIES) {
            this.logger.error(`Token fetch failed after ${this.MAX_RETRIES} attempts: ${this.formatError(error)}`);
            throw new Error(`Token fetch failed: ${error.response?.data?.error_description || error.message}`);
          }

          this.logger.warn(`Token fetch attempt ${attempts}/${this.MAX_RETRIES} failed. Retrying in ${this.RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        }
      }
    })();

    return this.tokenFetchPromise.finally(() => {
      this.tokenFetchPromise = null;
    });
  }

  private formatError(error: any): string {
    return JSON.stringify({
      status: error.response?.status,
      error: error.response?.data?.error,
      description: error.response?.data?.error_description,
      url: error.config?.url,
      client_id: this.configService.get('AUTH_CLIENT_ID')?.slice(0, 5) + '...', // Partial for security
    }, null, 2);
  }

  private isTokenValid(): boolean {
    return !!this.accessToken && Date.now() < this.tokenExpiresAt - 5000; // 5s buffer
  }

  async getToken(): Promise<string> {
    if (!this.isTokenValid()) {
      try {
        await this.fetchAccessToken();
      } catch (error) {
        this.logger.error(`Failed to refresh token: ${error.message}`);
        throw new Error('Authentication service unavailable - please check server logs');
      }
    }

    if (!this.accessToken) {
      throw new Error('No valid access token available');
    }

    return this.accessToken;
  }
}