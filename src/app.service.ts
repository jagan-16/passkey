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
                        const token = await this.tokenService.getToken(); // Debugging line
                        return {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        };
                      }

                      private buildUrl(endpoint: string): string {
                        return `https://${this.configService.get('TENANT')}.${this.configService.get('REGION')}.authaction.com/api/v1/passkey-plus/${this.configService.get('applicationId')}/${endpoint}`;
                      }

                      async createRegisterTransaction(externalId: string) {
                        try {
                          const response = await axios.post(
                            this.buildUrl('transaction/register'),
                            {
                              externalId : externalId,
                              displayName: 'My Device'
                            },
                            { headers: await this.getHeaders() }
                          );
                          console.log(response.data ); // Debugging line
                          return response.data.data.transactionId; // Adjusted to match the expected response structure
                          ; // Debugging line
                        } catch (error) {
                          console.log(error.response.data); // Debugging line
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
                          return response.data.data.transactionId; // Adjusted to match the expected response structure
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
                          return response.data.data.transactionId; // Adjusted to match the expected response structure
                        } catch (error) {
                          throw new InternalServerErrorException('Nonce verification failed');
                        }
                      }
                    }