import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import { ProvideAuth } from './services';

/**
 * @dfinity/agent requires this. Can be removed once it's fixed
 */
(window as any).global = window

ReactDOM.render(
  <React.StrictMode>
    <ProvideAuth>
      <App />
    </ProvideAuth>
  </React.StrictMode>,
  document.getElementById('root'),
)
