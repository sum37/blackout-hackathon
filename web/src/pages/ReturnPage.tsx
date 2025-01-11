import "../styles/ReturnPage.css";
import BackHeader from "../components/BackHeader";
import TreeCard from "../components/TreeCard";
import { useEffect, useState } from "react";
import { getUser } from "../axios";

const ReturnPage = () => {
  const time = 300;
  const price = 840;
  const current_points = 400;
  const new_points = 300;
  const total_points = 1000;

  const [points, setPoints] = useState(current_points);

  useEffect(() => {
    console.log("return page");
    getUser("1");
    setTimeout(() => {
      setPoints(prev => prev += new_points);
    }, 1000);
  }, []);

  console.log(points);


  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="return-page">
      <BackHeader />
      <div className="sub-title tree-page-title">주행이 종료되었습니다.</div>
      <TreeCard progress={points * 100 / total_points} />
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
          <span className="return-value">{points}</span>
        </div>
      </div>

      <button className="return-confirm">확인</button>
    </div>
  );
};

export default ReturnPage;
