import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getFriendRequests, acceptFriendRequest } from '../app/api/api';

type FriendRequest = {
  username: string;
};

type FriendRequestsContextType = {
  requests: FriendRequest[];
  loading: boolean;
  refetchRequests: () => Promise<void>;
  acceptRequest: (username: string) => Promise<void>;
};

const FriendRequestsContext = createContext<FriendRequestsContextType>({
  requests: [],
  loading: true,
  refetchRequests: async () => {},
  acceptRequest: async () => {},
});

type Props = {
  children: ReactNode;
};

export const FriendRequestsProvider = ({ children }: Props) => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getFriendRequests();
      setRequests(res.data.requests);
    } catch (e) {
      console.error("Failed to fetch friend requests", e);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (username: string) => {
    try {
      await acceptFriendRequest(username);
      setRequests(prev => prev.filter(r => r.username !== username));
    } catch (e) {
      console.error("Failed to accept request", e);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <FriendRequestsContext.Provider value={{ requests, loading, refetchRequests: fetchRequests, acceptRequest }}>
      {children}
    </FriendRequestsContext.Provider>
  );
};

export const useFriendRequests = () => useContext(FriendRequestsContext);