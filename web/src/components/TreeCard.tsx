import React, { useEffect, useState } from "react";
import "../styles/TreeShortCut.css";
import axios from "axios";

import bamboo1 from "../assets/bamboo_1.png";
import bamboo2 from "../assets/bamboo_2.png";
import bamboo3 from "../assets/bamboo_3.png";
import bamboo4 from "../assets/bamboo_4.png";

import cherryblossom1 from "../assets/cherryblossom_1.png";
import cherryblossom2 from "../assets/cherryblossom_2.png";
import cherryblossom3 from "../assets/cherryblossom_3.png";
import cherryblossom4 from "../assets/cherryblossom_4.png";

import maple1 from "../assets/maple_1.png";
import maple2 from "../assets/maple_2.png";
import maple3 from "../assets/maple_3.png";
import maple4 from "../assets/maple_4.png";

import pine1 from "../assets/pine_1.png";
import pine2 from "../assets/pine_2.png";
import pine3 from "../assets/pine_3.png";
import pine4 from "../assets/pine_4.png";


interface TreeCardProps {
  progress: number;
  tree_type: string;
}

const TreeCard = ({ progress, tree_type }: TreeCardProps) => {
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
