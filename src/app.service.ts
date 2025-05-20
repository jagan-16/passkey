import { Injectable } from '@nestjs/common';
import { PassageFlex } from '@passageidentity/passage-flex-node';

@Injectable()
export class PasskeyService {
  private passage: PassageFlex;

  constructor() {
    // Initialize Passage client with credentials
    this.passage = new PassageFlex({
      appId: process.env.PASSAGE_APP_ID!,   // your Passage App ID
      apiKey: process.env.PASSAGE_API_KEY!, // your Passage API Key
    });
  }

  /**
   * Starts passkey registration using WebAuthn.
   * @param externalId - Typically user's email or your internal user ID.
   * @returns Object with WebAuthn `nonce` to send to frontend.
   */
  async createRegisterChallenge(externalId: string) {
    // Construct the request object with the required properties
    const request = { 
      externalId, 
      passkeyDisplayName: 'User’s Device' // Provide a display name for the passkey
    };

    // Call the SDK with the request object
    const trasactionId = await this.passage.createRegisterTransaction(request);

    // Return the nonce for the browser
    return { trasactionId };
  }

  /**
   * Starts passkey authentication using WebAuthn.
   * @param externalId - The same user ID you used at registration.
   * @returns Object with WebAuthn `nonce` to send to frontend.
   */
  async createAuthenticateChallenge(externalId: string) {
    // Construct the request object
    const request = { externalId };

    // Call the SDK with the request object
    const trasactionId = await this.passage.createAuthenticateTransaction(request);

    // Return the nonce for the browser
    return { trasactionId };
  }

  /**
   * Verifies the nonce after WebAuthn completes in the browser.
   * @param nonce - The one-time nonce returned by `register` or `authenticate`.
   * @returns The `externalId` of the successfully verified user.
   */
  async verifyNonce(nonce: string): Promise<string> {
    const externalId = await this.passage.verifyNonce(nonce);
    return externalId;
  }
}
