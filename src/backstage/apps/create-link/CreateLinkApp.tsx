import { useEffect, useState } from 'react';

import { LoadingState } from '../../../common/components/LoadingState';
import { useApiClient } from '../../../common/hooks/useApiClient';
import { List } from '../../../common/models/List';
import { Post, PostSource } from '../../../posts/models/Post';
import { PostSelector } from './components/PostSelector';

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

    function sortAndLimitPosts(unsortedPosts: Post[]) {
      return unsortedPosts.reverse().slice(0, 8);
    }

    setSourcePosts(sortAndLimitPosts(sourcePostsResponse.items));
    setDestinationPosts(sortAndLimitPosts(destinationPostsResponse.items));

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
    }
  }

  useEffect(() => {
    if (apiClient && step === Step.syncingPosts) {
      syncPosts();
    }
  }, [apiClient]);

  return (
    <>
      <h2>Crear enlace</h2>

      {{
        [Step.syncingPosts]: () => (
          <LoadingState label={currentlySyncingLabel} />
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

            <button disabled={!canCreateLink} onClick={createLink}>
              Crear enlace
            </button>
          </div>
        ),
        [Step.creatingLink]: () => <LoadingState label="Creando enlace" />,
        [Step.linkCreated]: () => <div>Enlace creado</div>,
      }[step]()}
    </>
  );
}
