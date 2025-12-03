import React, { createContext, useContext } from 'react';

interface CloudCannonContextType {
  pageSlug?: string;
  contentPath?: string;
}

const CloudCannonContext = createContext<CloudCannonContextType>({});

export const useCloudCannon = () => useContext(CloudCannonContext);

interface CloudCannonProviderProps {
  children: React.ReactNode;
  pageSlug?: string;
  contentPath?: string;
}

export const CloudCannonProvider: React.FC<CloudCannonProviderProps> = ({ 
  children, 
  pageSlug,
  contentPath 
}) => {
  return (
    <CloudCannonContext.Provider value={{ pageSlug, contentPath }}>
      {children}
    </CloudCannonContext.Provider>
  );
};

