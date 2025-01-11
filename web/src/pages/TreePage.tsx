import "../styles/TreePage.css";
import BackHeader from "../components/BackHeader";
import TreeCard from "../components/TreeCard";

const TreePage = () => {
  return (
    <>
      <BackHeader />
      <div className="sub-title tree-page-title">나의 나무 도감</div>
      <div className="cards-container">
        <TreeCard treeType="bamboo" progress={30} />
        <TreeCard treeType="maple" progress={50} />
        <TreeCard treeType="cherryBlossom" progress={80} />
        <TreeCard treeType="pine" progress={100} />
      </div>
    </>
  );
};

export default TreePage;
