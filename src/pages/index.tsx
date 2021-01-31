import React from 'react';
import { GetServerSideProps } from 'next';

import { LinkGrid } from '../links/components/LinkGrid';
import { Link } from '../links/models/Link';
import { SortDirection } from '../common/models/SortDirection';

import styles from './Home.module.scss';
import { LogoFull } from '../common/components/svg/LogoFull';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryParams = new URLSearchParams({
    sortBy: 'createdAt',
    sortDirection: SortDirection.desc.toString(),
  });

  // TODO: BASE_URL should come from some config
  let baseUrl = process.env.BASE_URL;

  if (!baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`;
  }

  const linksApiUrl = `${baseUrl}/api/links?${queryParams}`;
  console.log(linksApiUrl);

  const linksResponse = await fetch(linksApiUrl);
  const { items: links } = await linksResponse.json();

  return {
    props: {
      links,
    },
  };
};

export interface HomeProps {
  links: Link[];
}

export default function Home(props: HomeProps): JSX.Element {
  const { links } = props;

  function handleLinkClick(linkId: string): void {
    const link = links.find(({ id }) => id === linkId);

    // TODO: Register the visit somewhere. We'll just redirect to the link for now.
    window.location.href = link.destinationUrl;
  }

  return (
    <div className={styles.home}>
      <main className={styles.home__main}>
        <div className={styles.home__logo}>
          <LogoFull />
          <a
            className={styles.home__logo__link}
            href="https://theway.coach/blog/"
          >
            Ir al blog →
          </a>
        </div>
        <p className={styles.home__info}>
          Pulsa sobre una publicación de Instagram para ir al enlace asociado
        </p>
        <LinkGrid links={links} onClick={handleLinkClick} />
      </main>
    </div>
  );
}
