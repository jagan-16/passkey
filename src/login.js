import React, { useState } from 'react';
import { PasskeyPlus } from '@authaction/passkey-plus-sdk';

const passkeyPlus = new PasskeyPlus({
  tenantDomain: "authsecurity.in.authaction.com", // Remove https:// from domain
  appId: "682df3fae5e046f280dd9016",
});

function Login() {
  const [loading, setLoading] = useState(false);
  
  const login = async () => {
    try {
      setLoading(true);
      
      // 1. Get authentication challenge from backend
      const challengeRes = await fetch('http://localhost:3000/passkey/authenticate-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ externalId: 'jagan@gmail.com' })
      });

      if (!challengeRes.ok) {
        throw new Error('Failed to get authentication challenge');
      }

      const { transaction_id } = await challengeRes.json();

      // 2. Start passkey authentication flow
      const nonce = await passkeyPlus.authenticate(transaction_id, {
        isConditionalMediation: true // For seamless autofill UI
      });

      // 3. Verify nonce with backend
      const verifyRes = await fetch('http://localhost:3000/passkey/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nonce })
      });

      if (!verifyRes.ok) {
        throw new Error('Verification failed');
      }

      console.log('Login successful');
      // Handle successful login (store token, redirect, etc.)
      
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={login} 
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? 'Authenticating...' : 'Login with Passkey'}
    </button>
  );
}

export default Login;