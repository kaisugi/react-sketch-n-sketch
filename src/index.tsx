import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ZEITUIProvider } from '@zeit-ui/react'

ReactDOM.render(
  <ZEITUIProvider> 
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ZEITUIProvider>,
  document.getElementById('root')
);
