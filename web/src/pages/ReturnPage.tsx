import "../styles/ReturnPage.css";
import BackHeader from "../components/BackHeader";
import TreeCard from "../components/TreeCard";
import { useEffect, useState } from "react";
import { getTree } from "../axios";
import { useLocation, useNavigate } from "react-router-dom";

interface State {
  time: number;
  price: number;
  treeId: number;
  treeExpUpdate: number;
}

const ReturnPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { time, price, treeId, treeExpUpdate } = state as State;

  const total_points = 1000;

  const [points, setPoints] = useState<number | null>(null);
  const [treeType, setTreeType] = useState<string | null>(null);

  useEffect(() => {
    console.log("return page");
    getTree(treeId).then((res) => {
      const r = res.data.exp;
      setPoints(r - treeExpUpdate);
      setTreeType(res.data.tree_type);

      setTimeout(() => {
        setPoints(r);
      }, 3000);
    }).catch((e) => console.log(e));
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
