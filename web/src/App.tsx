import "./styles/App.css";
import MapPage from "./pages/MapPage";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import TreePage from "./pages/TreePage";
import ReturnPage from "./pages/ReturnPage";
import BambooPage from "./pages/BambooPage";
import PinePage from "./pages/PinePage";
import CherryPage from "./pages/CherryPage";
import MaplePage from "./pages/MaplePage";
import { useEffect, useRef, useState } from "react";

function App() {
  const [, setSize] = useState({ width: 0, height: 0 });
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
          <Route path="/my-bamboo" element={<BambooPage />} />
          <Route path="/my-pine" element={<PinePage />} />
          <Route path="/my-cherryblossom" element={<CherryPage />} />
          <Route path="/my-maple" element={<MaplePage />} />
          <Route path="/return" element={<ReturnPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
