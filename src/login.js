import React from 'react';
import { PassageFlex } from '@passageidentity/passage-flex-js'

const passageFlex = new PassageFlex('TstZQQiQIRzHtkkxXGnfGk5Z');

function Login() {
  const login = async () => {
    const res = await fetch('http://localhost:3000/passkey/authenticate-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ externalId: 'jagan@gmail.com' })
    });

    const { trasactionId } = await res.json();

    const nonce = await passageFlex.passkey.authenticate({ trasactionId })
    console.log('Login result:', nonce);
  };

  return <button onClick={login}>Login with Passkey</button>;
}

export default Login;