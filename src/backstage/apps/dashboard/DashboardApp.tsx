import { FormEvent, useRef, useState } from 'react';

export function DashboardApp() {
  const formRef = useRef();

  enum State {
    Idle,
    GeneratingToken,
    TokenGenerated,
    Error,
  }
  const [state, setState] = useState<State>(State.Idle);

  const [token, setToken] = useState<string | null>(null);

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
  }

  return (
    <>
      <h2>Dashboard</h2>
      <h3>Generador de tokens</h3>
      <p>
        ⚠️🚨⚠️🚨⚠️🚨⚠️🚨 Estos tokens no se pueden revocar sin que ello implique
        revocar todos los tokens existentes, asi que ten cuidado con ellos 👀
        ⚠️🚨⚠️🚨⚠️🚨⚠️🚨
      </p>
      <form onSubmit={handleFormSubmit} ref={formRef}>
        <label htmlFor="length">Duración:</label>
        <select name="length" id="length">
          <option value="86400">1 dia</option>
          <option value="604800">1 semana</option>
          <option value="31536000">1 año</option>
          <option value="315360000">10 años</option>
        </select>
        <button type="submit">Generar token</button>
      </form>
    </>
  );
}
