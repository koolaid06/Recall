import { createContext, useContext, useState } from "react";

const MemoryContext = createContext(null);

export function MemoryProvider({ children }) {
  const [file, setFile] = useState(null);
  const [recordingId, setRecordingId] = useState(null);

  function startNewMemory() {
    setFile(null);
    setRecordingId(null);
  }

  return (
    <MemoryContext.Provider
      value={{
        file,
        setFile,
        recordingId,
        setRecordingId,
        startNewMemory,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemory() {
  return useContext(MemoryContext);
}