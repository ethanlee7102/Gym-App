import { createContext, useContext, useEffect, useState, ReactNode } from 'react';


interface ProfilePicMap {
  [username: string]: string; // map username to profilePicUrl
}

interface ProfileContextType {
  profilePics: ProfilePicMap;
  setProfilePic: (username: string, url: string) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profilePics: {},
  setProfilePic: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profilePics, setProfilePics] = useState<ProfilePicMap>({});

  const setProfilePic = (username: string, url: string) => {
    setProfilePics((prev) => ({ ...prev, [username]: url }));
  };

  return (
    <ProfileContext.Provider value={{ profilePics, setProfilePic }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfilePics = () => useContext(ProfileContext);