import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { canisterId as identityCanisterId } from './internet-identity/.dfx/local/canisters/internet_identity/internet_identity';
import { canisterId as backendCanisterId } from './.dfx/local/canisters/backend/backend';
import dfxJson from './dfx.json';

// List of all aliases for canisters
const aliases = Object.entries(dfxJson.canisters).reduce(
  (acc, [name, _value]) => {
    // Get the network name, or `local` by default.
    const networkName = process.env['DFX_NETWORK'] || 'local'
    const outputRoot = path.join(
      __dirname,
      '.dfx',
      networkName,
      'canisters',
      name,
    )

    return {
      ...acc,
      // ['dfx-generated/' + name]: path.join(outputRoot, name + '.js'),
      ['ic:' + name]: path.join(outputRoot, name + '.js'),
      ['ic:' + name + '/types']: path.join(outputRoot, name + '.d.ts'),
    }
  },
  {},
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    LOCAL_IDENTITY_CANISTER_ID: JSON.stringify(identityCanisterId),
    LOCAL_BACKEND_CANISTER_ID: JSON.stringify(backendCanisterId),
  },
  resolve: {
    alias: {
      ...aliases,
    },
  },
})
