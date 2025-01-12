import { useEffect, useRef, useState } from "react";
import "../styles/MapPage.css";
import { LatLng, Nutrient, ParkingSpace } from "../types";
import BackHeader from "../components/BackHeader";
import { endDriving, getDrivingDataByUser, getNutrients, getParkingSpaces, postNutrient, predictHelmet, startDriving } from "../axios";
import useUser from "../useUser";
import { useNavigate } from "react-router-dom";
import WebcamContainer, { WebcamContainerRef } from "../components/WebcamContainer";
import ParkingModal from "../components/\bParkingModal";

// 이미지 객체로 그룹화
const images = {
  cherryblossom: {
      0: "https://github.com/user-attachments/assets/a4b272d1-9cb9-4f19-98c0-fd3ac4c67d60",
      1: "https://github.com/user-attachments/assets/b95f7147-64ff-4611-b7a9-87872a89b78c"
  },
  pine: {
      0: "https://github.com/user-attachments/assets/1c2cbbe9-cd0b-4d26-ace1-dc8503e93b7c",
      1: "https://github.com/user-attachments/assets/3e02e96f-c597-4958-8e5e-dccda73df3f0"
  },
  bamboo: {
      0: "https://github.com/user-attachments/assets/d63597c0-5a2d-424b-9900-e0a214d9f84b",
      1: "https://github.com/user-attachments/assets/94f7aa8c-71b6-4faa-9fa8-0e4ddceffde3"
  },
  maple: {
      0: "https://github.com/user-attachments/assets/a8aabaf8-6532-4200-9e31-165945ba1d34",
      1: "https://github.com/user-attachments/assets/640a768a-89ec-45cb-9a7a-15199630c3d8"
  }
}

type FlowerType = "cherryblossom" | "pine" | "bamboo" | "maple";

const getFlowerImage = (flowerName: FlowerType, isDrained: boolean) => {
  return images[flowerName][isDrained ? 0 : 1];
}

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
  
  const [appropriatePlaces, setAppropriatePlaces] = useState<ParkingSpace[]>(
    []
  );
  const [seeds, setSeeds] = useState<Nutrient[]>([]);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [isDriving, setIsDriving] = useState(false);
  const [isWearingHelmet, setIsWearingHelmet] = useState(true);

  const [time, setTime] = useState(0);
  const [price, setPrice] = useState(0);
  const [currentPoint, setCurrentPoint] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPos, setCurrentPos] = useState<LatLng | null>(null);
  
  const webcamRef = useRef<WebcamContainerRef>(null);

  const drawSeed = (map: kakao.maps.Map, loc: LatLng, flowerName: string, isDrained: boolean) => {
    if (!map) {
      return;
    }
    const position = new window.kakao.maps.LatLng(loc.lat, loc.lng);

    const imageSrc = getFlowerImage(flowerName as FlowerType, isDrained);
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
      const {center_x, center_y, width, height} = place;
      const sw = new kakao.maps.LatLng(center_y - (height / 2), center_x + (width / 2));
      const ne = new kakao.maps.LatLng(center_y + (height / 2), center_x - (width / 2));
      console.log(sw, ne);

      const rectangleBounds = new kakao.maps.LatLngBounds(sw, ne);
      const rectangle = new kakao.maps.Rectangle({
        bounds: rectangleBounds, // 그려질 사각형의 영역정보입니다
        strokeWeight: 4, // 선의 두께입니다
        strokeColor: '#0bb94f', // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'shortdashdot', // 선의 스타일입니다
        fillColor: '#0bb94f', // 채우기 색깔입니다
        fillOpacity: 0.4 // 채우기 불투명도 입니다
      });
      rectangle.setMap(map);
      console.log('rectangle');
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
            setCurrentPoint(res.data.active_drive.nutrient_success);
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

  const isInRecommendedParking = (lat: number, lng: number): boolean => {
    if (!appropriatePlaces.length) {
      console.log("No recommended parking areas available.");
      return false;
    }
  
    // 현재 위치를 Kakao LatLng 객체로 변환
    const currentPosition = new kakao.maps.LatLng(lat, lng);
  
    // 권장 주차 구간 배열을 순회하며 현재 위치가 포함되어 있는지 확인
    return appropriatePlaces.some((place) => {
      const { center_x, center_y, width, height } = place;
  
      // 주차 구간의 경계 계산
      const sw = new kakao.maps.LatLng(center_y - height / 2, center_x - width / 2);
      const ne = new kakao.maps.LatLng(center_y + height / 2, center_x + width / 2);
      const bounds = new kakao.maps.LatLngBounds(sw, ne);
  
      // 현재 위치가 주차 구간 내에 있는지 확인
      return bounds.contain(currentPosition);
    });
  };

  const handleReturnClick = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const isInRecommended = isInRecommendedParking(lat, lon);

      if (!isInRecommended) {
        // 모달 띄우기
        setIsModalOpen(true);
        setCurrentPos({lat, lng: lon});
        return;
      }
    });
  };

  const handleModalConfirmClick = () => {
    if (!currentPos) {
      return;
    }
    const {lat, lng} = currentPos;

    endDriving({user_id: user,
    x: lat,
    y: lng}).then((res) => {
      const {tree_id, exp} = res.data;
      setIsDriving(false);
      setCurrentPos(null);
      navigate("/return", {state: {time, price, treeId: tree_id, treeExpUpdate: exp}});
    })
    setIsModalOpen(false);
  }

  const handleModelCancelClick = () => {
    setIsModalOpen(false);
  }

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
          </div>
          <WebcamContainer ref={webcamRef} size={{width: 124, height: 135,}} />
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
                <span className="return-value">{currentPoint}</span>
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
            {isModalOpen && (
      <ParkingModal
        onConfirm={handleModalConfirmClick}
        onCancel={handleModelCancelClick}
      />
    )}
    </>
  );
};

export default MapPage;
