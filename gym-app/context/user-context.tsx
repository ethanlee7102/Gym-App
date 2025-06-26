import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getMe } from '@/app/api/api';

type User = {
  username: string;
  friends: { username: string }[];
  // add more fields l8er
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refetchUser: async () => {}, // default no-op
});

type Props = {
  children: ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await getMe();
      setUser(res.data);
    } catch (e) {
      console.error('User fetch failed', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refetchUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);