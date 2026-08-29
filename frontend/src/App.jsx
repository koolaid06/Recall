import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Memory from "./pages/Memory";

import { MemoryProvider } from "./context/MemoryContext";

export default function App() {
  return (
    <MemoryProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/memory/:id" element={<Memory />} />
      </Routes>
    </MemoryProvider>
  );
}
