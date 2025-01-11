import "./styles/App.css";
import MainPage from "./pages/MainPage";
import MapPage from "./pages/MapPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TreePage from "./pages/TreePage";
import WebcamPage from "./pages/WebcamPage";
import ReturnPage from "./pages/ReturnPage";
import BambooPage from "./pages/BambooPage";
import PinePage from "./pages/PinePage";
import CherryPage from "./pages/CherryPage";
import MaplePage from "./pages/MaplePage";
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
          <Route path="/" element={<MainPage />} />
          <Route path="/maps" element={<MapPage />} />
          <Route path="/my-trees" element={<TreePage />} />
          <Route path="/my-bamboo" element={<BambooPage />} />
          <Route path="/my-pine" element={<PinePage />} />
          <Route path="/my-cherryblossom" element={<CherryPage />} />
          <Route path="/my-maple" element={<MaplePage />} />
          <Route path="/webcam" element={<WebcamPage size={size} />} />
          <Route path="/return" element={<ReturnPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
