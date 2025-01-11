import "../styles/TreePage.css";
import BackHeader from "../components/BackHeader";
import TreeCard from "../components/TreeCard";

const TreePage = () => {
  return (
    <>
      <BackHeader />
      <div className="sub-title tree-page-title">나의 나무 도감</div>
      <div className="cards-container">
        <TreeCard progress={30} />
        <TreeCard progress={50} />
        <TreeCard progress={80} />
        <TreeCard progress={100} />
      </div>
    </>
  );
};

export default TreePage;
