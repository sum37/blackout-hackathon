import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/MapPage.css";
import { LatLng } from "../types";

const MapPage = () => {
  const [appropriatePlaces, setAppropriatePlaces] = useState<LatLng[]>([
    { lat: 37.504, lng: 127.042 },
  ]); //TODO: For Test
  const [seeds, setSeeds] = useState<LatLng[]>([]);
  const [map, setMap] = useState<kakao.maps.Map>();

  const displayMarker = (map: kakao.maps.Map, loc: LatLng) => {
    if (!map) {
      return;
    }
    const position = new window.kakao.maps.LatLng(loc.lat, loc.lng);

    const imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
      imageSize = new kakao.maps.Size(64, 69),
      imageOption = {
        offset: new kakao.maps.Point(27, 69),
      };

    const image = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    // 마커를 생성합니다
    const marker = new kakao.maps.Marker({
      position,
      image,
      opacity: 0.5,
    });

    kakao.maps.event.addListener(marker, "mouseover", function () {
      marker.setOpacity(1.0);
    });

    kakao.maps.event.addListener(marker, "mouseout", function () {
      marker.setOpacity(0.5);
    });

    kakao.maps.event.addListener(marker, "click", function () {
      console.log("click marker");
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
  };

  useEffect(() => {
    if (!map) {
      return;
    }
    appropriatePlaces.forEach((pos) => {
      displayMarker(map, pos);
    });

    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const newPlace = { lat, lng };

          console.log(newPlace);
          displayMarker(map, newPlace);
          setSeeds((prevPlaces) => {
            return [...prevPlaces, newPlace];
          });
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [map]);

  const initMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        console.log(pos.coords.latitude);
        console.log(pos.coords.longitude);

        const container = document.getElementById("map");
        if (!container) {
          return;
        }

        const curPos = new window.kakao.maps.LatLng(lat, lon);
        const options = {
          center: curPos,
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        setMap(map);
      });
    }
  };

  useEffect(() => {
    window.kakao.maps.load(() => {
      initMap();
    });
  }, []);

  const handleReturnClick = () => {
    console.log("return");
  };

  return (
    <>
      <Header />
      <div id="map"></div>
      <div className="card">
        <div className="progress-section">
          <div className="progress-left">
            <div className="progress-title">75%</div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
          <img alt="Profile Image" className="profile-image" />
        </div>
        <div className="content-section">
          <ul className="details">
            <li>주행시간</li>
            <li>영양</li>
            <li>금액</li>
          </ul>
          <button onClick={handleReturnClick} className="return-button">
            반납하기
          </button>
        </div>
      </div>
    </>
  );
};

export default MapPage;
