import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { Image } from 'expo-image';
import { getFeed } from '@/app/api/api';

interface Post {
  userId: { username: string, profilePicture: string};
  
  caption: string;
  imageUrl: string;
  createdAt: string;
}

interface FeedContextType {
  posts: Post[];
  loading: boolean;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
  refetchFeed: () => Promise<void>;
}

const FeedContext = createContext<FeedContextType>({
  posts: [],
  loading: true,
  fetchMore: async () => {},
  hasMore: true,
  refetchFeed: async () => {},
});

const preloadImages = async (posts: Post[]) => {
  await Promise.all(
    posts.map(post => Image.prefetch(post.imageUrl))
  );
};

export const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 4;
  const fetchingRef = useRef(false);

  const fetchFeed = async () => {
    if (fetchingRef.current || !hasMore) return;
    fetchingRef.current = true;

    try {
      const res = await getFeed(page, PAGE_SIZE);
      const newPosts = res.data.posts;

       await preloadImages(newPosts);

      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
      if (newPosts.length < PAGE_SIZE) setHasMore(false);
    } catch (e) {
      console.error('Feed preload failed', e);
    }
    finally {
      fetchingRef.current = false;
    }
    
  };

    const refetchFeed = async () => {
    fetchingRef.current = false;
    setLoading(true);
    setPage(1);
    setHasMore(true);
    try {
        const res = await getFeed(1, PAGE_SIZE);
        const newPosts = res.data.posts;
        await preloadImages(newPosts);
        setPosts(newPosts);
        setPage(2);
        if (newPosts.length < PAGE_SIZE) setHasMore(false);
    } catch (e) {
        console.error('Feed refetch failed', e);
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchFeed();
      setLoading(false);
    };
    load();
  }, []);

  return (
    <FeedContext.Provider value={{ posts, loading, fetchMore: fetchFeed, hasMore, refetchFeed }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => useContext(FeedContext);