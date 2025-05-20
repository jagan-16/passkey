import React from 'react';
import { PassageFlex } from '@passageidentity/passage-flex-js'

const passageFlex = new PassageFlex('TstZQQiQIRzHtkkxXGnfGk5Z');

function Register() {
  const register = async () => {
  

    const res = await fetch('http:////localhost:3000/passkey/register-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ externalId: 'jagan@gmail.com' })
    });

    const { trasactionId } = await res.json();
   
    const nonce = await passageFlex.passkey.register(trasactionId );

    await fetch('http://localhost:3000/passkey/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nonce })
    });

    console.log('✅ Registration and verification complete');
  };

  return <button onClick={register}>Register with Passkey</button>;
}

export default Register;