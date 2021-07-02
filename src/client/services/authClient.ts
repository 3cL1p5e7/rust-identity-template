import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { getIdentityUrl } from './config';

export class AuthClientWrapper {
  public authClient?: AuthClient;
  public ready = false;
  constructor() {
    return this;
  }

  // Create a new auth client and update it's ready state
  async create() {
    this.authClient = await AuthClient.create();
    await this.authClient?.isAuthenticated();
    this.ready = true;
  }

  async login(): Promise<Identity | undefined> {
    console.log('[AuthClientWrapper] try to login');
    return new Promise(async (resolve) => {
      const identityProvider = getIdentityUrl();

      await this.authClient?.login({
        identityProvider,
        onSuccess: async () => {
          console.log('[AuthClientWrapper] login success to', identityProvider);
          resolve(this.authClient?.getIdentity());
        },
      });
    });
  }

  async logout() {
    console.log('[AuthClientWrapper] logout');
    return this.authClient?.logout({ returnTo: '/' });
  }

  async getIdentity() {
    return this.authClient?.getIdentity();
  }

  async isAuthenticated() {
    return this.authClient?.isAuthenticated();
  }
}

export const authClient = new AuthClientWrapper();