import { Actor, HttpAgent, HttpAgentOptions } from '@dfinity/agent'
import { idlFactory as backend_idl, canisterId as backend_id } from 'ic:backend';
import IBackend from 'ic:backend/types';
import { getHttpAgentOptions, isLocalhost } from './config';

export class AgentController {
  private options: HttpAgentOptions;
  private agent: HttpAgent;
  protected authorized: boolean = false;
  backend: IBackend;
  canisterId: string = '';

  constructor() {
    this.options = getHttpAgentOptions();

    const { agent, backend } = this.initialize(this.options);
    this.agent = agent;
    this.backend = backend;
    this.backend.get_canister_principal().then(p => this.canisterId = p.toString());
  }

  authorize = async (opts: Partial<HttpAgentOptions>) => {
    this.options = {...this.options, ...opts};
    
    const { agent, backend } = this.initialize(this.options);
    this.agent = agent;
    this.backend = backend;
    this.authorized = !!opts.identity;
  };

  unautorize = async () => {
    this.options = getHttpAgentOptions();

    const { agent, backend } = this.initialize(this.options);
    this.agent = agent;
    this.backend = backend;
    this.authorized = false;
  };

  private initialize = (opts: HttpAgentOptions) => {
    const agent = new HttpAgent(opts);
    const backend: IBackend = Actor.createActor(backend_idl, { agent, canisterId: backend_id });
    
    console.log('[AgentController] initialized with options', opts);

    if (isLocalhost) {
      console.error('dev mode');
      agent.fetchRootKey();
    }

    return { agent, backend };
  };
}
