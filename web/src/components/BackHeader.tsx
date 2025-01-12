import { useNavigate } from "react-router-dom";
import ArrowLeft from "../assets/arrow-left.png";
import Logo from "../assets/logo.png";


interface BackHeaderProps {
  prevPath?: string;
  showHeader?: boolean;
}

const BackHeader = ({ prevPath, showHeader = true }: BackHeaderProps) => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    console.log(prevPath);
    if (prevPath) {
      navigate(prevPath);
    } else {
      navigate("/");
    }
  };

  return (
    <div className={`back-header${showHeader ? " show-header" : ""}`}>
      <button className="back-button" onClick={handleClickBack}>
        <img src={ArrowLeft} alt={"<="} />
      </button>
      {showHeader && <span className="header-title">
        <img className="logo-image" src={Logo} alt="GPT" />
      </span>}
    </div>
  );
};

export default BackHeader;
