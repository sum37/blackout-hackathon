import "../styles/BambooPage.css";
import BackHeader from "../components/BackHeader";
import DetailTreeCard from "../components/DetailTreeCard";

const MaplePage = () => {
  return (
    <>
      <BackHeader />
      <div className="sub-title tree-page-title">대나무</div>
      <div className="cards-container">
        <DetailTreeCard progress={30} />
      </div>
    </>
  );
};

export default MaplePage;
