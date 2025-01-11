import { useEffect, useRef, useState } from "react";
import "../styles/MapPage.css";
import { LatLng, Nutrient, ParkingSpace } from "../types";
import BackHeader from "../components/BackHeader";
import { endDriving, getDrivingDataByUser, getNutrients, getParkingSpaces, postNutrient, predictHelmet, startDriving } from "../axios";
import useUser from "../useUser";
import { useNavigate } from "react-router-dom";
import WebcamContainer, { WebcamContainerRef } from "../components/WebcamContainer";

const getFlowerImage = (flowerName: string, is_drained: boolean) => {
  return `https://c87c-210-207-40-218.ngrok-free.app/static/images/${flowerName}_${is_drained ? 1 : 0}.png`
};

const MapPage = () => {
  const user = useUser();
  const navigate = useNavigate();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  
  const [appropriatePlaces, setAppropriatePlaces] = useState<ParkingSpace[]>();
  const [seeds, setSeeds] = useState<Nutrient[]>([]);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [isDriving, setIsDriving] = useState(false);
  const [isWearingHelmet, setIsWearingHelmet] = useState(true);

  const [time, setTime] = useState(0);
  const [price, setPrice] = useState(0);
  
  const webcamRef = useRef<WebcamContainerRef>(null);

  const displayMarker = (map: kakao.maps.Map, loc: LatLng) => {
    if (!map) {
      return;
    }
    const position = new window.kakao.maps.LatLng(loc.lat, loc.lng);

    const imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png";
    const imageSize = new kakao.maps.Size(64, 69);
    const imageOption = {
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

  const drawSeed = (map: kakao.maps.Map, loc: LatLng, flowerName: string, isDrained: boolean) => {
    if (!map) {
      return;
    }
    const position = new window.kakao.maps.LatLng(loc.lat, loc.lng);

    const imageSrc = getFlowerImage(flowerName, isDrained);
    const imageSize = new kakao.maps.Size(25, 25);
    const imageOption = {
      offset: new kakao.maps.Point(25, 25),
    };

    const image = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    // 마커를 생성합니다
    const marker = new kakao.maps.Marker({
      position,
      image,
      opacity: 1.0,
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
  };

  useEffect(() => {
    if (!map || !appropriatePlaces) {
      return;
    }
    appropriatePlaces.forEach((place) => {
      const {center_x, center_y} = place;
      // TODO 영역 만들기
      const pos = {lat: center_x, lng: center_y}
      displayMarker(map, pos);
    });
  }, [appropriatePlaces, map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    // 주변 씨앗 정보 가져오기
    getNutrients()
    .then((res) => {
      res.data.forEach((s) => {
        drawSeed(map, {lat: s.planted_x, lng: s.planted_y}, s.nutrient_type, s.is_drained);
      })
      setSeeds(res.data);
    })
    .catch((e) => {
      console.log(e);
    })

    // 주차 권장 공간 가져오기
    getParkingSpaces()
    .then((res) => {
      setAppropriatePlaces(res.data);
    })
    .catch((e) => {
      console.log(e);
    })

    // Driving 여부 확인
    getDrivingDataByUser(user)
    .then((res) => {
      const sessions = res.data;
      if (!sessions) {
        // not driving
        setIsDriving(false);
      }
      setIsDriving(!sessions.every((s) => s.progress == "finished"));
    })
    .catch((e) => {
      setIsDriving(false);
      console.log(e);
    })
  }, [map]);

  useEffect(() => {
    if (!isDriving) {
      return;
    }

    const interval1 = setInterval(() => {
      setTime((prevCount) => prevCount + 1);
    }, 1000);

    const interval3  = setInterval(() => {
      setPrice((prev) => prev + 50);
    }, 5000);

    const interval2 = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const newPlace = { lat, lng };
          
          const lastSeed = seeds[seeds.length - 1];
          if (lastSeed && newPlace.lat == lastSeed.planted_x && newPlace.lng == lastSeed.planted_y) {
            return;
          }
          postNutrient({
            x: lat,
            y: lng,
            planted_by: user,
            // nutrient_type: string;
            is_drained: !isWearingHelmet,
          }).then((res) => {
            const nut = res.data.nutrient;
            setSeeds((prevPlaces) => {
              return [...prevPlaces, nut];
            });
            if (map) {
              drawSeed(map, {lat: nut.planted_x, lng: nut.planted_y}, nut.nutrient_type, nut.is_drained);
            }
          }).catch((e) => console.log(e));
        });
      }
    }, 1000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
    }
  }, [isDriving]);

  const handleStartRide = () => {
    startDriving(user).then(() => {
      setIsDriving(true);
      // 헬멧 체크
      if (webcamRef.current) {
        const url = webcamRef.current.capture();
        console.log(url);
        if (!url) {
          return;
        }
        const form = new FormData();
        form.append('file', dataURLtoFile(url));
        predictHelmet(form).then((res) => {
          //TODO: prediction 제일 큰거로 바꾸기?
          console.log(res.data);
          const predictions = res.data.predictions;
          if (!predictions.length) {
            setIsWearingHelmet(false);
            return;
          }
          setIsWearingHelmet(predictions[0].class == 1);
        });
        
      }
    }).catch((e) => {
      console.log(e);
    })
  }

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
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      endDriving({user_id: user,
        x: lat,
        y: lon}).then((res) => {
          const {tree_id, exp} = res.data;
          setIsDriving(false);
          navigate("/return", {state: {time, price, treeId: tree_id, treeExpUpdate: exp}});
        })
    });
  };

  function dataURLtoFile(dataURL: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "screenshot.png", { type: mime });
  }

  const cameraSize = ({width: 124, height: 135});

  return (
    <>
      <BackHeader showHeader={false} />
      <div style={{width: cameraSize.width, height: cameraSize.height}} className="video-mask"/>
      <WebcamContainer style={{position: "absolute", right: "0"}} ref={webcamRef} size={cameraSize} />
      <div id="map"></div>
        {
          isDriving ?
          <div className="card">
        <div className="progress-section">
          <div className="progress-left">
            <div className="progress-title">75%</div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
          <WebcamContainer ref={webcamRef} size={{width: 124, height: 135}} />
        </div>
            <div className="content-section">
            <div className="return-container">
              <div className="return-row">
                <span>주행 시간</span>
                <span className="return-value">{formatTime(time)}</span>
              </div>
              <div className="return-row">
                <span>금액</span>
                <span className="return-value">{`${price} 원`}</span>
              </div>
              <div className="return-row">
                <span>적립된 포인트</span>
                <span className="return-value">{3}</span>
              </div>
            </div>
              <button onClick={handleReturnClick} className="return-button">
                반납하기
              </button>
            </div>
            </div>
          :
            <button className="ride-button" onClick={handleStartRide}>Scan to Ride</button>
        }
    </>
  );
};

export default MapPage;
