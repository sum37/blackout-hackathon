interface DetailTreeCardProps {
    progress: number;
  }
  
  const DetailTreeCard = ({ progress }: DetailTreeCardProps) => {
    // 단계 계산
    const getStageText = (progress: number): string => {
      if (progress >= 0 && progress < 25) return "1단계";
      if (progress >= 25 && progress < 50) return "2단계";
      if (progress >= 50 && progress < 75) return "3단계";
      if (progress >= 75 && progress <= 100) return "4단계";
      return ""; // 안전 장치
    };
  
    return (
      <div className="detail-card-container">
        <img className="detail-tree-image" alt="trees" />
        {/* 단계 표시 텍스트 */}
        <div className="detail-stage-text">{getStageText(progress)}</div>
        <div className="detail-progress-container">
          <div className="detail-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="detail-progress-labels">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>
    );
  };
  
  export default DetailTreeCard;
  