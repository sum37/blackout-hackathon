import React, { useEffect, useState } from "react";
import "../styles/TreeShortCut.css";
import axios from "axios";

import bamboo1 from "../assets/bamboo_1.png";
import bamboo2 from "../assets/bamboo_2.png";
import bamboo3 from "../assets/bamboo_3.png";
import bamboo4 from "../assets/bamboo_4.png";

import cherryblossom1 from "../assets/cherryblossom_1.png";
import cherryblossom2 from "../assets/cherryblossom_2.png";
import cherryblossom3 from "../assets/cherryblossom_3.png";
import cherryblossom4 from "../assets/cherryblossom_4.png";

import maple1 from "../assets/maple_1.png";
import maple2 from "../assets/maple_2.png";
import maple3 from "../assets/maple_3.png";
import maple4 from "../assets/maple_4.png";

import pine1 from "../assets/pine_1.png";
import pine2 from "../assets/pine_2.png";
import pine3 from "../assets/pine_3.png";
import pine4 from "../assets/pine_4.png";

const TreeShortCut = () => {
  const [trees, setTrees] = useState<{ tree_type: string; exp: number }[]>([]);

  const getStageText = (progress: number): string => {
    if (progress >= 0 && progress < 25) return "1단계";
    if (progress >= 25 && progress < 50) return "2단계";
    if (progress >= 50 && progress < 75) return "3단계";
    if (progress >= 75 && progress <= 100) return "4단계";
    return "1단계"; // 안전 장치
  };

  const getImagePath = (stage: string, tree_type: string): string => {
    switch (tree_type) {
      case "bamboo":
        switch (stage) {
          case "1단계":
            return bamboo1;
          case "2단계":
            return bamboo2;
          case "3단계":
            return bamboo3;
          case "4단계":
            return bamboo4;
          default:
            return bamboo1; // 기본 이미지
        }
      case "cherryblossom":
        switch (stage) {
          case "1단계":
            return cherryblossom1;
          case "2단계":
            return cherryblossom2;
          case "3단계":
            return cherryblossom3;
          case "4단계":
            return cherryblossom4;
          default:
            return cherryblossom1; // 기본 이미지
        }
      case "pine":
        switch (stage) {
          case "1단계":
            return pine1;
          case "2단계":
            return pine2;
          case "3단계":
            return pine3;
          case "4단계":
            return pine4;
          default:
            return pine1; // 기본 이미지
        }
      case "maple":
        switch (stage) {
          case "1단계":
            return maple1;
          case "2단계":
            return maple2;
          case "3단계":
            return maple3;
          case "4단계":
            return maple4;
          default:
            return maple1; // 기본 이미지
        }
      default:
        return "../assets/default.png"; // 기본 이미지
    }
  };

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const response = await axios.get("http://ec2-54-208-212-70.compute-1.amazonaws.com:8000/trees/user/1");
        const treesData = response.data;

        // 특정 tree_type만 필터링
        const filteredTrees = ["bamboo", "cherryblossom", "maple", "pine"].map((type) =>
          treesData.find((tree: { tree_type: string }) => tree.tree_type === type) || { tree_type: type, exp: 0 }
        );

        setTrees(filteredTrees);
      } catch (error) {
        console.error("Failed to fetch tree data:", error);
      }
    };

    fetchTreeData();
  }, []);

  return (
    <div className="tree-shortcut-container">
      {trees.map((tree) => (
        <div key={tree.tree_type} className="tree-shortcut">
          <img
            className="tree-shortcut-image"
            alt={tree.tree_type}
            src={getImagePath(getStageText(tree.exp), tree.tree_type)} // tree_type과 단계에 따라 이미지 결정
          />
        </div>
      ))}
    </div>
  );
};

export default TreeShortCut;
