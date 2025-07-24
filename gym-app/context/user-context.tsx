import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getMe } from '@/app/api/api';

interface User  {
    username: string;
    friends: Friend[];
    userId: string;
    level: number;
    streak: number;
    title: string;
    quizComplete: boolean;
    weight: number | null;
    gender: 'Male' | 'Female' | 'other' | null;
    personalRecords: PersonalRecords;
    profilePicture: string;
    dots: number;
    DOTSrank: 'Unranked' | 'Iron' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Elite' | 'Freak' | 'GOAT';
    
  // add more fields l8er
};

interface Friend {
    username: string;
};

interface PersonalRecords {
  squat: number;
  bench: number;
  deadlift: number;
}


type UserContextType = {
    user: User | null;
    loading: boolean;
    refetchUser: () => Promise<User | null>;
};

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    refetchUser: async () => null, // default no-op
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
        return res.data;
        } catch (e) {
        console.error('User fetch failed', e);
        setUser(null);
        return null;
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