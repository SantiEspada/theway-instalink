import { useEffect, useState } from 'react';

import { LoadingState } from '../../../common/components/LoadingState';
import { CheckedCircle } from '../../../common/components/svg/CheckedCircle';
import { useApiClient } from '../../../common/hooks/useApiClient';
import { List } from '../../../common/models/List';
import { Post, PostSource } from '../../../posts/models/Post';
import { PostSelector } from './components/PostSelector';

import styles from './CreateLinkApp.module.scss';

export function CreateLinkApp() {
  const apiClient = useApiClient();

  enum Step {
    syncingPosts,
    waitingForPostSelection,
    creatingLink,
    linkCreated,
  }
  const [step, setStep] = useState<Step>(Step.syncingPosts);

  const [sourcePosts, setSourcePosts] = useState<Post[]>([]);
  const [destinationPosts, setDestinationPosts] = useState<Post[]>([]);
  const [currentlySyncingLabel, setCurrentlySyncingLabel] =
    useState<string>('');
  const [sourcePost, setSourcePost] = useState<Post | null>(null);
  const [destinationPost, setDestinationPost] = useState<Post | null>(null);

  function refreshPosts() {
    setStep(Step.syncingPosts);
    syncPosts();
  }

  async function syncPosts() {
    // We're not syncing both at the same time since this endpoint takes some time
    // and it's fearly easy to reach the timeout in cold boots when served as a lambda.
    // The blog source is faster so we start with that one, then instagram.

    setCurrentlySyncingLabel('Sincronizando artículos del blog');

    await apiClient.post<null>('posts/sync', {
      sources: [PostSource.blog],
    });

    setCurrentlySyncingLabel('Sincronizando publicaciones de instagram');

    await apiClient.post<null>('posts/sync', {
      sources: [PostSource.instagram],
    });

    // By this time we have all the posts refreshed, so we can just fetch them
    const [sourcePostsResponse, destinationPostsResponse] = await Promise.all([
      apiClient.get<List<Post>>('posts', { source: PostSource.instagram }),
      apiClient.get<List<Post>>('posts', { source: PostSource.blog }),
    ]);

    function limitPostsResponse({ items }: { items: Post[] }): Post[] {
      return items.slice(0, 8);
    }

    setSourcePosts(limitPostsResponse(sourcePostsResponse));
    setDestinationPosts(limitPostsResponse(destinationPostsResponse));

    setStep(Step.waitingForPostSelection);
  }

  const canCreateLink = sourcePost && destinationPost;

  async function createLink() {
    if (canCreateLink) {
      setStep(Step.creatingLink);

      await apiClient.post('links', {
        sourcePostId: sourcePost.id,
        destinationPostId: destinationPost.id,
      });

      setStep(Step.linkCreated);
      setTimeout(() => {
        setStep(Step.waitingForPostSelection);
        setSourcePost(null);
        setDestinationPost(null);
      }, 5 * 1000);
    }
  }

  useEffect(() => {
    if (apiClient && step === Step.syncingPosts) {
      syncPosts();
    }
  }, [apiClient]);

  return (
    <>
      <h2 className={styles.title_row}>
        Crear enlace
        {step === Step.waitingForPostSelection && (
          <button onClick={refreshPosts} className={styles.title_row__button}>
            Actualizar publicaciones
          </button>
        )}
      </h2>

      {{
        [Step.syncingPosts]: () => (
          <div className={styles.loading_container}>
            <LoadingState label={currentlySyncingLabel} />
          </div>
        ),
        [Step.waitingForPostSelection]: () => (
          <div>
            <h3>Publicación de Instagram</h3>
            <PostSelector
              posts={sourcePosts}
              selectedPost={sourcePost}
              onPostSelected={setSourcePost}
            />

            <h3>Artículo del blog</h3>
            <PostSelector
              posts={destinationPosts}
              selectedPost={destinationPost}
              onPostSelected={setDestinationPost}
            />
            <div className={styles.action_row}>
              <button
                disabled={!canCreateLink}
                onClick={createLink}
                className={styles.action_row__button}
              >
                Crear enlace
              </button>
            </div>
          </div>
        ),
        [Step.creatingLink]: () => (
          <div className={styles.loading_container}>
            <LoadingState label="Creando enlace" />
          </div>
        ),
        [Step.linkCreated]: () => (
          <div className={styles.loading_container}>
            {/* FIXME: make this into a component */}
            <div className={styles.link_created}>
              <CheckedCircle className={styles.link_created__icon} />
              <span className={styles.link_created__label}>Enlace creado</span>
            </div>
          </div>
        ),
      }[step]()}
    </>
  );
}
