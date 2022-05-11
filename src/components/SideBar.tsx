import React from 'react'
import { userObject } from '../app/types';
import { useLocation, useHistory } from 'react-router-dom';

function SideBar ({profileData} : {profileData : userObject}) {
  const history = useHistory()
  const location = useLocation()

  function showGames() {
    history.push('/games')
  }
  function showHome() {
    history.push('/home')
  }
  function showEditor(){
    history.push(`/gameEditor/${profileData.username ? profileData.username : "guest"}/new`)
  }
  function showRankings() {
    history.push('/rankings')
  }
  return (
    <div className = "sideBar">
        <div className = {`sideBarButton ${location.pathname.includes('/home') ? 'sideBarButtonSelected' : ""}`} onClick = {()=>{showHome()}}>
          <img className = "sideIcon" src = "/images/homeButton.png"></img>
          <div className = "sideLabel" >Home</div>
        </div>
        <div className = {`sideBarButton ${location.pathname.includes('/games') ? 'sideBarButtonSelected' : ""}`} onClick = {()=>{showGames()}}>
          <img className = "sideIcon" src = "/images/browseButton.png"></img>
          <div className = "sideLabel">Browse</div>
        </div>
        <div className = {`sideBarButton ${location.pathname.includes('/gameEditor') ? 'sideBarButtonSelected' : ""}`} onClick = {()=>{showEditor()}}>
          <img className = "sideIcon" src = "/images/pencil2.png"></img>
          <div className = "sideLabel">Create</div>
        </div>
        <div className = {`sideBarButton ${location.pathname.includes('/rankings') ? 'sideBarButtonSelected' : ""}`} onClick = {()=>{showRankings()}}>
          <img className = "sideIcon" src = "/images/trophy.png"></img>
          <div className = "sideLabel">Ranks</div>
        </div>  
    </div>
  );
}

export default SideBar