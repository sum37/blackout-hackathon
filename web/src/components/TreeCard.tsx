import { useMemo } from "react";

// 이미지 파일들 import
import bamboo_1 from "../assets/bamboo_1.png";
import bamboo_2 from "../assets/bamboo_2.png";
import bamboo_3 from "../assets/bamboo_3.png";
import bamboo_4 from "../assets/bamboo_4.png";

import cherryblossom_1 from "../assets/cherryblossom_1.png";
import cherryblossom_2 from "../assets/cherryblossom_2.png";
import cherryblossom_3 from "../assets/cherryblossom_3.png";
import cherryblossom_4 from "../assets/cherryblossom_4.png";

import maple_1 from "../assets/maple_1.png";
import maple_2 from "../assets/maple_2.png";
import maple_3 from "../assets/maple_3.png";
import maple_4 from "../assets/maple_4.png";

import pine_1 from "../assets/pine_1.png";
import pine_2 from "../assets/pine_2.png";
import pine_3 from "../assets/pine_3.png";
import pine_4 from "../assets/pine_4.png";

// 이미지 객체로 그룹화
const images: Record<string, Record<number, string>> = {
  bamboo: {
    1: bamboo_1,
    2: bamboo_2,
    3: bamboo_3,
    4: bamboo_4,
  },
  cherryblossom: {
    1: cherryblossom_1,
    2: cherryblossom_2,
    3: cherryblossom_3,
    4: cherryblossom_4,
  },
  maple: {
    1: maple_1,
    2: maple_2,
    3: maple_3,
    4: maple_4,
  },
  pine: {
    1: pine_1,
    2: pine_2,
    3: pine_3,
    4: pine_4,
  },
};

interface TreeCardProps {
  progress: number;
  treeType: string;
}

const TreeCard = ({ progress, treeType }: TreeCardProps) => {
    const treeAddress = useMemo(() => {
        const age = Math.ceil(progress / 25);
        return images[treeType]?.[age];
    }, [progress, treeType]);

    const name = useMemo(() => {
        switch (treeType) {
            case "bamboo":
                return "대나무"
            case "cherryblossom":
                return "벚꽃"
            case "maple":
                return "단풍나무"
            case "pine":
                return "소나무"
            default:
                return "소나무"
        }
    }, [treeType]);

  return (
    <div className="tree-card">
      <img className="tree-image" alt="trees" src={treeAddress} />
      <div className="tree-name">{name}</div>
      <div className="progress-container">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default TreeCard;
