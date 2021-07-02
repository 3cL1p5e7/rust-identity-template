import React, { useCallback, useEffect, useState } from 'react';
import logo from './assets/logo.svg';
import { useAuth } from './services';

export function App() {
  const [principal, setPrincipal] = useState('');
  const { login, logout, agent, authClient } = useAuth();

  const fetchPrincipal = useCallback(() => {
    // agent..then(principal => setPrincipal(principal.toString()));
    authClient.getIdentity()
      .then(identity => identity?.getPrincipal()?.toString() || 'NOT AUTHORIZED')
      .then(setPrincipal)
  }, [authClient]);
  useEffect(fetchPrincipal, []);
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Authorized as {principal}</p>
        <button onClick={() => login().then(fetchPrincipal)}>Auth!</button>
        <button onClick={() => logout().then(fetchPrincipal)}>Logout</button>
      </header>
    </div>
  )
};
