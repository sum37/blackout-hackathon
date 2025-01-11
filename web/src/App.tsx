import "./styles/App.css";
import MapPage from "./pages/MapPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TreePage from "./pages/TreePage";
import WebcamPage from "./pages/WebcamPage";
import ReturnPage from "./pages/ReturnPage";
import { useEffect, useRef, useState } from "react";

function App() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screenRef.current) {
      const { offsetWidth, offsetHeight } = screenRef.current;
      setSize({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  return (
    <div ref={screenRef} id="main-screen">
      <Router>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/maps" element={<MapPage />} />
          <Route path="/my-trees" element={<TreePage />} />
          <Route path="/webcam" element={<WebcamPage size={size} />} />
          <Route path="/return" element={<ReturnPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
