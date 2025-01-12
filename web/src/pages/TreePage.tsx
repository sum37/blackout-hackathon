import "../styles/TreePage.css";
import BackHeader from "../components/BackHeader";
import TreeCard from "../components/TreeCard";
import { useEffect, useState } from "react";
import { getTreesByUser } from "../axios";
import useUser from "../useUser";
import { Tree } from "../types";
import { useNavigate } from "react-router-dom";

const TreePage = () => {
  const [trees, setTrees] = useState<Tree[]>();
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    getTreesByUser(user)
      .then((res) => {
        setTrees(res.data);
      })
      .catch((e) => console.log(e));
  }, []);

  const handleCardClick = (tree_type: string) => {
    navigate(`/my-${tree_type}`)
  }

  return (
    <>
      <BackHeader />
      <div className="sub-title tree-page-title">나의 나무 도감</div>
      <div className="cards-container">
        {
          trees?.map(({id, tree_type, exp}) => <TreeCard onClick={() => handleCardClick(tree_type)} key={id} treeType={tree_type} progress={exp / 1000 * 100} />)
        }
      </div>
    </>
  );
};

export default TreePage;
