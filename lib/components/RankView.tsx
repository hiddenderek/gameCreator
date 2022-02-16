import React, { useRef, useEffect, useState, useReducer } from 'react';
import { handleApiData } from './Apicalls';
;
function RankView() {
  const [rankData, setRankData] = useState([])
  type rankItem = {
    score: number, 
    username: string
  }
  useEffect(()=>{
    handleApiData(`${location.pathname}/scores`, setRankData, "get", null)
  },[])
  return (
    <div className={`fullHeight fullWidth topLeft absolute flexCenter flexDirColumn rankView`}>
      <h1>QUICKEST COMPLETION TIME: </h1>
      <p>&nbsp;</p>
      <ul className = "rankList">
        {rankData.length > 0 ? 
        rankData.map((item: rankItem, index)=><li><p className = "left">{`${index + 1}. ${item.username.toUpperCase()}`}</p><p className = "right">{`SCORE: ${item.score} second(s)`}</p></li>)
        : "None. Be the first one to win!"}
      </ul>
    </div>
  );
}

export default RankView
      
