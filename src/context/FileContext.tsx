import React, { createContext, useContext, useState } from 'react';

// Define the context type
interface FileContextType {
  fileName: string | null;
  setFileName: (fileName: string | null) => void;
}

// Create the context with default value
const FileContext = createContext<FileContextType>({
  fileName: null,
  setFileName: () => {},  // default empty function
});

// Custom hook for consuming the context
const useFileName = () => useContext(FileContext);

// Provider component
interface FileContextProviderProps {
  children: React.ReactNode;
}

const FileContextProvider: React.FC<FileContextProviderProps> = ({ children }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <FileContext.Provider value={{ fileName, setFileName }}>
      {children}
    </FileContext.Provider>
  );
};

export { FileContext, FileContextProvider, useFileName };
