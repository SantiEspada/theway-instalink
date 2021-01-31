import { MouseEvent } from 'react';

import { Link } from '../models/Link';

import styles from './LinkGrid.module.scss';

export interface LinkCardProps {
  linkId: string;
  pictureUrl: string;
  destinationUrl;
  title: string;
  onClick: (linkId: string) => void;
}

function LinkCard(props: LinkCardProps): JSX.Element {
  const {
    linkId,
    pictureUrl,
    destinationUrl,
    title,
    onClick,
    ...otherProps
  } = props;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event?.preventDefault();

    onClick(linkId);
  }

  return (
    <a
      href={destinationUrl}
      className={styles.linkCard}
      {...otherProps}
      title={title}
      onClick={handleClick}
    >
      <img
        className={styles.linkCard__picture}
        src={pictureUrl}
        alt={title}
      ></img>
    </a>
  );
}

export interface LinkGridProps {
  links: Link[];
  onClick: (linkId: string) => void;
}

export function LinkGrid(props: LinkGridProps): JSX.Element {
  const { links, onClick, ...otherProps } = props;

  function transformLinkToLinkCard(link: Link): JSX.Element {
    const { id, pictureUrl, destinationUrl, title } = link;

    const props: LinkCardProps = {
      linkId: id,
      pictureUrl,
      destinationUrl,
      title,
      onClick,
    };

    return <LinkCard key={id} {...props} />;
  }

  return (
    <div className={styles.linkGrid} {...otherProps}>
      {links.map(transformLinkToLinkCard)}
    </div>
  );
}
