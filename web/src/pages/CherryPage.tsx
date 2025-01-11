import "../styles/CherryPage.css";
import BackHeader from "../components/BackHeader";
import DetailTreeCard from "../components/DetailTreeCard";
import { useEffect, useState } from "react";
import { getTreesByUser } from "../axios"; // API 요청 함수 임포트

const CherryPage = () => {
  const [CherryTreeExp, setCherryTreeExp] = useState<number | null>(null); // 벚나무 EXP 상태
  const ownerId = 1; // 사용자 ID (하드코딩 또는 동적 설정)

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        // API 호출
        const response = await getTreesByUser(ownerId);
        const trees = response.data;

        const CherryTree = trees.find((tree) => tree.tree_type === "cherryblossom");
        if (CherryTree) {
          setCherryTreeExp(CherryTree.exp); // EXP 값 설정
        } else {
          console.error("CherryBlossom tree not found!");
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
      <div className="sub-title tree-page-title">벚나무</div>
      <div className="cards-container">
      {CherryTreeExp !== null ? (
          <DetailTreeCard progress={CherryTreeExp} tree_type={"cherryblossom"} />
        ) : (
          <div>Loading...</div> // 로딩 중 표시
        )}
      </div>
    </>
  );
};

export default CherryPage;
