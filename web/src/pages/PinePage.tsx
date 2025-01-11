import "../styles/BambooPage.css";
import BackHeader from "../components/BackHeader";
import DetailTreeCard from "../components/DetailTreeCard";
import { useEffect, useState } from "react";
import { getTreesByUser } from "../axios"; // API 요청 함수 임포트

const PinePage = () => {
  const [PineTreeExp, setPineTreeExp] = useState<number | null>(null); // 대나무 나무 EXP 상태
  const ownerId = 1; // 사용자 ID (하드코딩 또는 동적 설정)

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        // API 호출
        const response = await getTreesByUser(ownerId);
        const trees = response.data;

        // tree_type이 "Pine"인 나무 찾기
        const PineTree = trees.find((tree) => tree.tree_type === "pine");
        if (PineTree) {
          setPineTreeExp(PineTree.exp); // EXP 값 설정
        } else {
          console.error("Pine tree not found!");
        }
      } catch (error) {
        console.error("Failed to fetch tree data:", error);
      }
    };

    fetchTreeData();
  }, []);

  return (
    <>
      <BackHeader />
      <div className="sub-title tree-page-title">소나무</div>
      <div className="cards-container">
      {PineTreeExp !== null ? (
          <DetailTreeCard progress={PineTreeExp} tree_type="pine"/>
        ) : (
          <div>Loading...</div> // 로딩 중 표시
        )}
      </div>
    </>
  );
};

export default PinePage;
