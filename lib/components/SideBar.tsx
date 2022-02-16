import React from 'react'
import { useHistory } from 'react-router-dom';
function SideBar () {
  const history = useHistory()
  function showGames() {
    history.push('/games')
  }
  function showHome() {
    history.push('/home')
  }
  function showRankings() {
    history.push('/rankings')
  }
  return (
    <div className = "sideBar">
        <div className = "sideBarButton" onClick = {()=>{showHome()}}>
          <img className = "sideIcon" src = "/images/homeButton.png"></img>
          <div className = "sideLabel" >Home</div>
        </div>
        <div className = "sideBarButton" onClick = {()=>{showGames()}}>
          <img className = "sideIcon" src = "/images/browseButton.png"></img>
          <div className = "sideLabel">Browse</div>
        </div>
        <div className = "sideBarButton" onClick = {()=>{showRankings()}}>
          <img className = "sideIcon" src = "/images/trophy.png"></img>
          <div className = "sideLabel">Ranks</div>
        </div>  
    </div>
  );
}

export default SideBar