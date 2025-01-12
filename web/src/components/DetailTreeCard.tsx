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

interface DetailTreeCardProps {
    progress: number;
    tree_type: string;
  }
  
  const DetailTreeCard = ({ progress, tree_type }: DetailTreeCardProps) => {
    // 단계 계산
    const getStageText = (progress: number): string => {
      if (progress >= 0 && progress < 250) return "1단계";
      if (progress >= 250 && progress < 500) return "2단계";
      if (progress >= 500 && progress < 750) return "3단계";
      if (progress >= 750 && progress <= 1000) return "4단계";
      return "1단계"; // 안전 장치
    };

    const getImagePath = (stage: string, tree_type: string): string => {
        switch (tree_type) {
          case "bamboo":
            switch(stage) {
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
            switch(stage) {
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
            switch(stage) {
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
            switch(stage) {
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
    
    const stageText = getStageText(progress);
    const imagePath = getImagePath(stageText, tree_type);
  
    return (
      <div className="detail-card-container">
        <img className="detail-tree-image" alt="trees" src={imagePath}/>
        <div className="detail-stage-text">{stageText}</div>
        <div className="detail-stage-text">{progress}</div> {/*나중에 없애야하는 줄 */}
        <div className="detail-progress-container">
          <div className="detail-progress-fill" style={{ width: `${progress / 10}%` }} />
        </div>
        <div className="detail-progress-labels">
          <span>0</span>
          <span>250</span>
          <span>500</span>
          <span>750</span>
          <span>1000</span>
        </div>
      </div>
    );
  };
  
  export default DetailTreeCard;
  