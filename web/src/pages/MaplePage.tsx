import "../styles/BambooPage.css";
import BackHeader from "../components/BackHeader";
import DetailTreeCard from "../components/DetailTreeCard";
import { useEffect, useState } from "react";
import { getTreesByUser } from "../axios"; // API 요청 함수 임포트

const MaplePage = () => {
  const [MapleTreeExp, setMapleTreeExp] = useState<number | null>(null); // 대나무 나무 EXP 상태
  const ownerId = 1; // 사용자 ID (하드코딩 또는 동적 설정)

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        // API 호출
        const response = await getTreesByUser(ownerId);
        const trees = response.data;

        // tree_type이 "Maple"인 나무 찾기
        const MapleTree = trees.find((tree) => tree.tree_type === "maple");
        if (MapleTree) {
          setMapleTreeExp(MapleTree.exp); // EXP 값 설정
        } else {
          console.error("Maple tree not found!");
        }
      } catch (error) {
        console.error("Failed to fetch tree data:", error);
      }
    };

    fetchTreeData();
  }, []);

  return (
    <>
      <BackHeader prevPath="/my-trees"/>
      <div className="sub-title tree-page-title">단풍나무</div>
      <div className="cards-container">
      {MapleTreeExp !== null ? (
          <DetailTreeCard progress={MapleTreeExp} tree_type="maple"/>
        ) : (
          <div>Loading...</div> // 로딩 중 표시
        )}
      </div>
    </>
  );
};

export default MaplePage;
