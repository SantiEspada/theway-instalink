import { CheckedCircle } from '../../../../common/components/svg/CheckedCircle';
import { Post } from '../../../../posts/models/Post';

import styles from './PostSelector.module.scss';

function PostSelectorItem({ pictureUrl, isSelected, onClick }) {
  return (
    <ul className={styles.item} onClick={onClick}>
      <img className={styles.item__picture} src={pictureUrl} />
      {isSelected && (
        <div className={styles.item__selectedOverlay}>
          <CheckedCircle />
        </div>
      )}
    </ul>
  );
}

interface PostSelectorProps {
  posts: Post[];
  selectedPost: Post | null;
  onPostSelected: (post: Post) => void;
}

export function PostSelector(props: PostSelectorProps) {
  const { posts, selectedPost, onPostSelected } = props;

  return (
    <li className={styles.list}>
      {posts.map((post) => (
        <PostSelectorItem
          key={post.id}
          pictureUrl={post.pictureUrl}
          isSelected={selectedPost && selectedPost.id === post.id}
          onClick={() => onPostSelected(post)}
        />
      ))}
    </li>
  );
}
