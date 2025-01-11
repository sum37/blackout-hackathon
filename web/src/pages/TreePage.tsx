import "../styles/TreePage.css";
import BackHeader from "../components/BackHeader";
import TreeCard from "../components/TreeCard";
import { useEffect, useState } from "react";
import { getTreesByUser } from "../axios";
import useUser from "../useUser";
import { Tree } from "../types";

const TreePage = () => {
  const [trees, setTrees] = useState<Tree[]>();
  const user = useUser();

  useEffect(() => {
    getTreesByUser(user)
      .then((res) => {
        setTrees(res.data);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <BackHeader />
      <div className="sub-title tree-page-title">나의 나무 도감</div>
      <div className="cards-container">
        {
          trees?.map(({id, tree_type, exp}) => <TreeCard key={id} treeType={tree_type} progress={exp / 1000 * 100} />)
        }
      </div>
    </>
  );
};

export default TreePage;
