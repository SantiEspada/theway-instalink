import React from 'react';
import { InstagramCredentialManager } from './components/InstagramCredentialManager';

export function ConfigApp() {
  return (
    <>
      <h2>Configuración</h2>
      <h3>Clave de acceso de Instagram</h3>
      <InstagramCredentialManager />
    </>
  );
}
