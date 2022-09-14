import React from 'react';
import { GetStaticProps } from 'next';

import { LinkCardLink, LinkGrid } from '../links/components/LinkGrid';
import { SortDirection } from '../common/models/SortDirection';
import { LogoFull } from '../common/components/svg/LogoFull';
import { FindLinksInteractor } from '../links/interactors/FindLinksInteractor';
import { Link } from '../links/models/Link';

import styles from './Home.module.scss';
import Head from 'next/head';

const findLinksInteractor = new FindLinksInteractor();

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { items: links } = await findLinksInteractor.interact({
    sort: {
      by: 'createdAt',
      direction: SortDirection.desc,
    },
  });

  function transformLinkToLinkCardLink(link: Link): LinkCardLink {
    const { id, pictureUrl, destinationUrl, title } = link;

    const linkCardLink: LinkCardLink = {
      id,
      pictureUrl,
      destinationUrl,
      title,
    };

    return linkCardLink;
  }

  const linkCardLinks = links.map(transformLinkToLinkCardLink);

  // TODO: again, maybe this should be in some config
  const revalidateTimeSecs = 60;

  return {
    props: {
      links: linkCardLinks,
    },
    revalidate: revalidateTimeSecs,
  };
};

export interface HomeProps {
  links: LinkCardLink[];
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
      <Head>
        <title>Elige una publicación - The Way</title>
      </Head>
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
