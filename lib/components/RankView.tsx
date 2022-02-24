import React, { useRef, useEffect, useState, useReducer } from 'react';
import { handleApiData } from './Apicalls';
import { userObject} from '../app/types'
function RankView({profileData} : {profileData: userObject}) {
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
        rankData.map((item: rankItem, index)=><li><p>{`${index + 1}. ${item.username.toUpperCase()}`}</p><p>{`SCORE: ${item.score} second(s)`}</p></li>)
        : `None. Win to get the best score!`}
        {profileData?.username ? "" : 
        <>
          <li>&nbsp;</li>
          <li>(YOU ARE NOT SIGNED IN. SCORES WILL NOT BE RECORDED.)</li>
        </>}
      </ul>
      
    </div>
  );
}

export default RankView
      
