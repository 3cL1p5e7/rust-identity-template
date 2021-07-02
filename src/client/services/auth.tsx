import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient as authenticationClient, AuthClientWrapper } from "./authClient";
import { Identity } from "@dfinity/agent";
import { AgentController } from './agent';

export const agent = (window as any).ic = new AgentController();

export interface AuthContext {
  isAuthenticated: boolean;
  isAuthReady: boolean;
  agent: AgentController;
  authClient: AuthClientWrapper;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// special thanks to cancan
export function useProvideAuth(authClient: typeof authenticationClient): AuthContext {
  const [isAuthenticatedLocal, setIsAuthenticatedLocal] = useState<boolean>(false);
  const [_identity, _setIdentity] = useState<Identity | undefined>();
  const [isAuthClientReady, setAuthClientReady] = useState(false);

  // Creating the auth client is async and no auth related checks can happen
  // until it's ready so we set a state variable to keep track of it
  if (!authClient.ready) {
    authClient.create().then(async () => {
      agent.authorize({identity: await authClient.getIdentity()}).then(() => {
        setAuthClientReady(true);
      });
      setAuthClientReady(true);
    });
  }

  // are authenticated, then set them to be fully logged in.
  useEffect(() => {
    if (!authClient.ready) return;
    Promise.all([authClient.getIdentity(), authClient.isAuthenticated()]).then(
      ([identity, isAuthenticated]) => {
        setIsAuthenticatedLocal(isAuthenticated || false);
        _setIdentity(identity);
        setAuthClientReady(true);
      }
    );
  }, [isAuthClientReady]);

  useEffect(() => {
    if (!authClient.ready) return;
    (async () => {
      const identity = await authClient.getIdentity();
      if (identity && !identity.getPrincipal().isAnonymous()) {
        _setIdentity(identity);
      }
    })();
  }, []);

  useEffect(() => {
    if (_identity && !_identity.getPrincipal().isAnonymous()) {
      setAuthClientReady(false);

      agent.authorize({identity}).then(() => {
        setAuthClientReady(true);
      });
    } else {
      agent.unautorize();
    }
  }, [_identity]);

  // Just creating variables here so that it's pretty below
  const identity = _identity;
  const isAuthenticated = isAuthenticatedLocal;

  // Login to the identity provider by sending user to Internet Identity
  // and logging them in.
  const login = async function (): Promise<void> {
    if (!authClient) {
      return;
    }
    let identity = await authClient.getIdentity();
    console.log('Principal before login', identity?.getPrincipal().toString());

    await authClient.login();

    identity = await authClient.getIdentity();
		console.log('Logged in', identity);
    console.log('Principal after login', identity?.getPrincipal().isAnonymous(), identity?.getPrincipal().toString());

    if (identity) {
      setIsAuthenticatedLocal(true);
      _setIdentity(identity);
    } else {
      console.error("Could not get identity from internet identity");
    }
  };

  async function logout() {
    let identity = await authClient.getIdentity();
    console.log('Principal before logout', identity?.getPrincipal().toString());

    setIsAuthenticatedLocal(false);
    await agent.unautorize();

    if (!authClient.ready) {
      return;
    }

    await authClient.logout();

    identity = await authClient.getIdentity();
    console.log('Principal after logout', identity?.getPrincipal().toString());
  }

  return {
    isAuthenticated,
    isAuthReady: isAuthClientReady,
    agent,
    login,
    logout,
    authClient,
  };
}

const authContext = createContext<AuthContext>(null!);

export function ProvideAuth({ children }: any) {
  const auth = useProvideAuth(authenticationClient);
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};