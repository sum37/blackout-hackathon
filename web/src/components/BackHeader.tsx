import { useNavigate } from "react-router-dom";

interface BackHeaderProps {
  showHeader?: boolean;
}

const BackHeader = ({ showHeader = true }: BackHeaderProps) => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    console.log("go to back");
    navigate("/");
  };

  return (
    <div className={`back-header${showHeader ? " show-header" : ""}`}>
      <button className="back-button" onClick={handleClickBack}>
        {"<-"}
      </button>
      {showHeader && <span className="header-title">GPT</span>}
    </div>
  );
};

export default BackHeader;
