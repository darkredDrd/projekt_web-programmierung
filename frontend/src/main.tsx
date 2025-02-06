import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RoleProvider } from './services/RoleContext';
import { ErrorProvider } from './services/ErrorContext';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ErrorProvider>
    <RoleProvider>
      <App />
    </RoleProvider>
  </ErrorProvider>
);