import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/MapPage.css";
import { LatLng } from "../types";

const MapPage = () => {
  const [appropriatePlaces, setAppropriatePlaces] = useState<LatLng[]>([
    { lat: 37.502, lng: 127.039 },
  ]); //TODO: For Test
  const [map, setMap] = useState<kakao.maps.Map>();

  const displayMarker = (map: kakao.maps.Map, loc: LatLng) => {
    if (!map) {
      return;
    }
    const position = new window.kakao.maps.LatLng(loc.lat, loc.lng);

    const imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 마커이미지의 주소입니다
      imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
      imageOption = {
        offset: new kakao.maps.Point(27, 69),
      }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    const image = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    // 마커를 생성합니다
    const marker = new kakao.maps.Marker({
      position,
      image, // 마커이미지 설정,
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
  }, [map]);

  const initMap = () => {
    let lat = 37.5035513;
    let lon = 127.0415171;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      });
    }

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
