import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loadGame, setGameSize } from '../features/gameData/gameData-slice';
import { setCurrentElement } from '../features/gameEditor/gameEditor-slice';
import { handleApiData } from './Apicalls';
import html2canvas from 'html2canvas'
function GameEditor ({turnOnSideBar, profileData} : any) {
  const gameData = useAppSelector((state) => state.gameData.gameData)
  const curGameName = useAppSelector((state) => state.gameData.gameName)
  const currentElement = useAppSelector((state) => state.gameEditor.currentElement)
  const location = useLocation()
  const [gameName, setGameName] = useState('')
  const dispatch = useAppDispatch()
  const {username} = profileData
  useEffect(()=>{
    console.log('sideBarON!!!')
    turnOnSideBar()
  },[])
  useEffect(()=>{
    if (location.pathname !== `/gameEditor/${username}/new`) {
      setGameName(curGameName)
    }
  },[curGameName])
  function dispatchCurrentElement(event: React.MouseEvent) {
    const target = event.target as HTMLDivElement
    const elementId = target.id
    if (elementId == "emptyElement") {
      dispatch(setCurrentElement("0"))
    }
    if (elementId == "groundElement") {
      dispatch(setCurrentElement("1"))
    }
    if (elementId == "lavaElement") {
      dispatch(setCurrentElement("2"))
    }
    if (elementId == "spikeElement") {
      dispatch(setCurrentElement("3"))
    }
    if (elementId == "goalElement") {
      dispatch(setCurrentElement("4"))
    }
  }

  function specifyGameName(e: any) {
    setGameName(e.target.value)
    console.log(gameName)
  }
  async function saveGameEdit() {
    const gridCanvas  = await html2canvas(document.getElementById('gameGrid') as HTMLElement,{backgroundColor:null})
    const gridImage = gridCanvas.toDataURL()
    console.log(gridImage)
    const saveGameResult = await handleApiData(`/games/${username}/${curGameName}`, null, location.pathname == `/gameEditor/${username}/new` ? 'post' : 'patch', { screen: "1-1", gameData: gameData, newGameName: gameName, gridImage: gridImage })
    console.log(saveGameResult)
  }
  return (
    <div id="gameEditor" className="gameEditor sideContent">
      <div id="title" className="gameEditorTitle flexCenter">Game Editor</div>
      {location.pathname !== `/gameEditor/${username}/new` && location.pathname !== `/gameEditor/${username}/${curGameName}` ? 
      <p className="rankLabel flexCenter">YOU MUST LOG IN TO SAVE CHANGES.</p>
       :
      <><form className="fullSize editorTitleChange">
        <span className="left flexCenter smallLabel autoWidth fullHeight">{location.pathname === `/gameEditor/${username}/new` ? "SET TITLE" : "CHANGE TITLE"}</span>
        <input className="right fullHeight" value = {'location.pathname' == `/gameEditor/${username}/new` ? '': gameName } placeholder="Game Name..." onInput={specifyGameName}></input>
      </form>
      <div className="gameEditorSave flexCenter fullWidth">
        <button id="saveButton" className="saveButton" onClick={saveGameEdit}>Save Game</button>
      </div>
      </>
       }
      <div id="editSection1Container" className="editSectionContainer" >
        <div id="editSection1Title" className="editSectionTitle">GROUND ELEMENTS</div>
        <div id="emptyElement" className={`emptyElement elementButton  ${currentElement === "0" ? "elementSelected" : ""}`} onClick={dispatchCurrentElement}>
        <span className = "absolute topLeft flexCenter elementLabel">EMPTY</span>
        </div>
        <div id="groundElement" className={`groundElement elementButton ${currentElement === "1" ? "elementSelected" : ""}`} onClick={dispatchCurrentElement}>
          <img className="elementImage"></img>
          <span className = "absolute topLeft flexCenter elementLabel">GROUND</span>
        </div>
        <div id="lavaElement" className={`lavaElement elementButton ${currentElement === "2" ? "elementSelected" : ""}`} onClick={dispatchCurrentElement}>
          <img className="elementImage"></img>
          <span className = "absolute topLeft flexCenter elementLabel">LAVA</span>
        </div>
        <div id="spikeElement" className={`spikeElement elementButton ${currentElement === "3" ? "elementSelected" : ""}`} onClick={dispatchCurrentElement}>
          <img className="elementImage"></img>
          <span className = "absolute topLeft flexCenter elementLabel">SPIKE</span>
        </div>
        <div id="goalElement" className={`goalElement elementButton ${currentElement === "4" ? "elementSelected" : ""}`} onClick={dispatchCurrentElement}>
          <img className="elementImage"></img>
          <span className = "absolute topLeft flexCenter elementLabel">GOAL</span>
        </div>
      </div>
    </div>
  );
}

export default GameEditor