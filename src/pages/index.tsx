import Head from 'next/head';

import { Header } from '../components/Header';
import { LoginForm } from '../components/LoginForm';

import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>InstaLink &bull; Iniciar sesión</title>
      </Head>

      <Header className={styles.header} />

      <main className={styles.main}>
        <LoginForm onSubmit={({ email }) => console.log(email)} />
      </main>
    </div>
  );
}
