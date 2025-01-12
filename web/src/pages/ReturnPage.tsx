import "../styles/ReturnPage.css";
import BackHeader from "../components/BackHeader";
import TreeCard from "../components/TreeCard";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface State {
  time: number;
  price: number;
  treeId: number;
  treeExpUpdate: number;
  curExp: number;
  treeType: string;
}

const ReturnPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { time, price, treeExpUpdate, curExp, treeType } = state as State;

  const total_points = 1000;

  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    setPoints(curExp - treeExpUpdate);
    setTimeout(() => {
      setPoints(curExp);
    }, 3000);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleConfirmClick = () => {
    navigate("/");
  }

  return (
    <div className="return-page">
      <BackHeader />
      <div className="sub-title tree-page-title">주행이 종료되었습니다.</div>
      {
        treeType !== null && points !== null &&
          <TreeCard treeType={treeType} progress={points * 100 / total_points} />
      }
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
          <span className="return-value">{treeExpUpdate}</span>
        </div>
      </div>

      <button onClick={handleConfirmClick} className="return-confirm">확인</button>
    </div>
  );
};

export default ReturnPage;
