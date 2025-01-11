import "../styles/ReturnPage.css";
import BackHeader from "../components/BackHeader";
import TreeCard from "../components/TreeCard";

const ReturnPage = () => {
  return (
    <>
      <BackHeader />
      <div className="sub-title tree-page-title">주행이 종료되었습니다.</div>
      <div className="cards-container">
        <TreeCard progress={30} />
        <TreeCard progress={50} />
        <TreeCard progress={80} />
        <TreeCard progress={100} />
      </div>
    </>
  );
};

export default ReturnPage;
