import { HttpAgentOptions } from '@dfinity/agent'

export const config = {
	LOCAL_HOST: 'http://localhost:8000',
	LOCAL_IDENTITY_URL: `http://localhost:8000?canisterId=${LOCAL_IDENTITY_CANISTER_ID}`,
	LOCAL_BACKEND_URL: `http://localhost:8000/PATH?canisterId=${LOCAL_BACKEND_CANISTER_ID}`,
	IDENTITY_URL: 'https://identity.ic0.app',
};

console.log('!!!!!!!', config);

export const isLocalhost = window.location.href.startsWith('http://localhost') || window.location.href.includes('127.0.0.1');

export const getHttpAgentOptions = (): HttpAgentOptions => (isLocalhost ? {
	host: config.LOCAL_HOST
} : {});

export const getIdentityUrl = () => (isLocalhost ? config.LOCAL_IDENTITY_URL : config.IDENTITY_URL);
