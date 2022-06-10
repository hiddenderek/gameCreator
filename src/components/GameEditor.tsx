import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCurrentElement } from '../features/gameEditor/gameEditor-slice';
import {handleApiData} from '../utils/apicalls';
import html2canvas from 'html2canvas'

function GameEditor ({turnOnSideBar, profileData} : any) {
  const {username} = profileData
  const gameData = useAppSelector((state) => state.gameData.gameData)
  const curGameName = useAppSelector((state) => state.gameData.gameName)
  const currentElement = useAppSelector((state) => state.gameEditor.currentElement)
  const location = useLocation()
  const [gameName, setGameName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const dispatch = useAppDispatch()
  
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
    if (elementId == "platformElement") {
      dispatch(setCurrentElement("5"))
    }
  }

  function specifyGameName(e: any) {
    setGameName(e.target.value)
    console.log(gameName)
  }
  
  async function saveGameEdit(e: any) {
    e.preventDefault()
    const gridCanvas = await html2canvas(document.getElementById('gameGrid') as HTMLElement, { backgroundColor: null })
    const gridImage = gridCanvas.toDataURL()
    console.log(gridImage)
    const saveGameResult = await handleApiData(`/games/${username}/${curGameName}`, null, location.pathname == `/gameEditor/${username}/new` ? 'post' : 'patch', { screen: "1-1", gameData: gameData, newGameName: gameName, gridImage: gridImage })
    if (saveGameResult?.status as number >= 400) {
      setErrorMessage(saveGameResult?.data)
    } else {
      setErrorMessage('')
    }
    console.log(saveGameResult)
  }

  return (
    <div id="gameEditor" className="gameEditor sideContent" >
      <h1 id="title" className="gameEditorTitle flexCenter">GAME EDITOR</h1>
      {location.pathname !== `/gameEditor/${username}/new` && location.pathname !== `/gameEditor/${username}/${curGameName}` ?
        <p className="rankLabel flexCenter">YOU MUST LOG IN TO SAVE CHANGES.</p>
        :
        <>
          <div className="fullSize flexEdges editorTitleChange">
            <label className="left flexCenter smallLabel autoWidth fullHeight">
              {location.pathname === `/gameEditor/${username}/new` ? "SET TITLE" : "CHANGE TITLE"}
            </label>
            <input data-testid = "game_title_input" className="right fullHeight"
              value={'location.pathname' == `/gameEditor/${username}/new` ? '' : gameName}
              placeholder="Game Name..." onInput={specifyGameName}>
            </input>
          </div>
          <form className="gameEditorSave flexCenter fullWidth" onSubmit={e => {saveGameEdit(e)}}>
            <button data-testid = "game_save_btn" id="saveButton" className="saveButton">Save Game</button>
          </form>
          <p className="gameEditorError flexCenter fullWidth">{errorMessage.toUpperCase()}</p>
        </>
      }
      <div id="editSection1Container" className="editSectionContainer" >
        <div id="editSection1Title" className="editSectionTitle">SELECT ELEMENTS</div>
        <div data-testid = "empty_element_btn" id="emptyElement" className={`emptyElement elementButton  ${currentElement === "0" ? "elementSelected" : ""}`} onClick={dispatchCurrentElement}>
          <span className="absolute topLeft flexCenter elementLabel">REMOVE</span>
        </div>
        <div data-testid = "ground_element_btn" id="groundElement" className={`groundElement elementButton ${currentElement === "1" ? "elementSelected" : ""}`} onClick={dispatchCurrentElement}>
          <img className="elementImage"></img>
          <span className="absolute topLeft flexCenter elementLabel">GROUND</span>
        </div>
        <div data-testid = "lava_element_btn" id="lavaElement" className={`lavaElement elementButton ${currentElement === "2" ? "elementSelected" : ""}`} onClick={dispatchCurrentElement}>
          <img className="elementImage"></img>
          <span className="absolute topLeft flexCenter elementLabel">LAVA</span>
        </div>
        <div data-testid = "spike_element_btn" id="spikeElement" className={`spikeElement elementButton ${currentElement === "3" ? "elementSelected" : ""}`} onClick={dispatchCurrentElement}>
          <img className="elementImage"></img>
          <span className="absolute topLeft flexCenter elementLabel">SPIKE</span>
        </div>
        <div data-testid = "goal_element_btn" id="goalElement" className={`goalElement elementButton ${currentElement === "4" ? "elementSelected" : ""}`} onClick={dispatchCurrentElement}>
          <img className="elementImage"></img>
          <span className="absolute topLeft flexCenter elementLabel">GOAL</span>
        </div>
        <div data-testid = "platform_element_btn" id="platformElement" className={`platformElement elementButton ${currentElement === "5" ? "elementSelected" : ""}`} onClick={dispatchCurrentElement}>
          <img className="elementImage"></img>
          <span className="absolute topLeft flexCenter elementLabel">PLATFORM</span>
        </div>
      </div>
    </div>
  );
}

export default GameEditor