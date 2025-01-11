interface TreeCardProps {
  progress: number;
}

const TreeCard = ({ progress }: TreeCardProps) => {
  return (
    <div className="tree-card">
      <img className="tree-image" alt="trees" />
      <div className="tree-name">이름</div>
      <div className="progress-container">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default TreeCard;
