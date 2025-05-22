import { PasskeyPlus } from "@authaction/passkey-plus-sdk";
import { useState } from 'react';

// Initialize with your actual credentials (use environment variables in production)
const passkeyPlus = new PasskeyPlus({
  tenantDomain: "authsecurity.in.authaction.com", // Replace with actual tenant
  appId: "682df3fae5e046f280dd9016", // Replace with actual app ID
});

function Register() {
  const [loading, setLoading] = useState(false);
  
  const register = async () => {
    try {
      setLoading(true);

      // 1. Get transaction ID from backend
      const challengeResponse = await fetch('http://localhost:3000/passkey/register-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ externalId: 'jagan@gmail.com' })
      });

      if (!challengeResponse.ok) {
        throw new Error('Failed to get registration challenge');
      }

      const { transaction_id } = await challengeResponse.json();

      // 2. Use the SDK with the actual transaction ID from backend
      const nonce = await passkeyPlus.register(transaction_id, {
        authenticatorAttachment: "platform", // or 'cross-platform'
      });

      // 3. Verify the nonce with backend
      const verificationResponse = await fetch('http://localhost:3000/passkey/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nonce })
      });

      if (!verificationResponse.ok) {
        throw new Error('Verification failed');
      }

      console.log('Registration and verification complete');
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={register} disabled={loading}>
      {loading ? 'Processing...' : 'Register with Passkey'}
    </button>
  );
}

export default Register;