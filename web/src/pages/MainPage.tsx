import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate
import "../styles/MainPage.css";
import TreeShortCut from "../components/TreeShortCut";
import Header from "../components/Header";

const MainPage = () => {
  const [, setMap] = useState<kakao.maps.Map | null>(null);
  const navigate = useNavigate(); // 페이지 이동 훅

  const initMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const container = document.getElementById("main-map");
        if (!container) {
          return;
        }

        const curPos = new window.kakao.maps.LatLng(lat, lon);
        const options = {
          center: curPos,
          level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);
      });
    }
  };

  useEffect(() => {
    window.kakao.maps.load(() => {
      initMap();
    });
  }, []);

  return (
    <>
      <Header />
      <div className="main-page-container">
        {/* Tree 컨테이너 클릭 시 /my-trees로 이동 */}
        <div
          className="main-page-tree-container"
          onClick={() => navigate("/my-trees")} // 페이지 이동
        >
          <TreeShortCut />
        </div>
        {/* Map 컨테이너 클릭 시 /map으로 이동 */}
        <div
          className="main-page-map-container"
          onClick={() => navigate("/maps")} // 페이지 이동
        >
          <div id="main-map" style={{ width: "100%", height: "100%" }}></div>
        </div>
        <div className="main-page-qr-container">
          <div className="scan-line"></div>
          <div className="scanToRide">Scan to Ride</div>
        </div>
        <div className="etc-container">
          <div className="service-center-container">
            <div></div>
          </div>
          <div className="custoemr-center-container">
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
