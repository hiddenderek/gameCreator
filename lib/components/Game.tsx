import React, { useRef, useEffect, useState, useReducer } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loadGame, setGameName, setGameLikes, setGameSize } from '../features/gameData/gameData-slice';
import GameElement from './GameElement'
import Character from './Character'
import HealthBar from './HealthBar'
import GameResult from './GameResult'
import RankView from './RankView'
import { spikeAlternate, timeCount } from './GameEvents';
import { setRankView } from '../features/userInterface/userInterface-slice';
import { useLocation } from 'react-router'
import { handleApiData } from './Apicalls';
import { userObject} from '../app/types'
function Game({profileData} : {profileData: userObject}) {
  const gameData: elementObj[] = useAppSelector((state) => state.gameData.gameData)
  const characterHealth = useAppSelector((state) => state.character.health)
  const gameWin = useAppSelector((state) => state.gameEvents.winGame)
  const timePlayed = useAppSelector((state)=> state.gameEvents.timer)
  const rankView = useAppSelector((state)=>state.userInterface.rankView)
  const gameRef = useRef<HTMLDivElement>(null);
  const gameGet = gameRef?.current?.getBoundingClientRect()
  const [gameScreen, setGameScreen] = useState("1-1")
  const [gameProps, setGameProps] = useState({})
  const location: any = useLocation()
  const dispatch = useAppDispatch()

  interface elementObj {
    type: string,
    [key: string]: any
  }
  interface specialProps {
    collisionActive: boolean
  }
  useEffect(() => {
    console.log('new game')
    dispatch(setRankView(false))
    dispatch(setGameSize({ width: gameGet?.width, height: gameGet?.height }))
    getGameData()
  }, [location.pathname])
  useEffect(()=> {
    if (gameWin === true) {
        console.log('posting score!')
        handleApiData(`${location.pathname}/scores/${profileData.username}`, null, "post", {score: timePlayed})
    }
  }, [gameWin])
  useEffect(()=>{
    if (gameProps !== {}){
      spikeAlternate()
      timeCount()
    }
  }, [gameProps])

  async function getGameData() {
    try {
      console.log('getting1')
      let responseDataResult = await handleApiData(null, setGameProps, "get", null)
      console.log(responseDataResult)
      if (!responseDataResult) {
        responseDataResult = await handleApiData(null, setGameProps, "get", null)
      }
      console.log('got')
      console.log(responseDataResult)
      dispatch(loadGame(responseDataResult.game_data[gameScreen].gameData))
      dispatch(setGameName(responseDataResult.game_name))
      dispatch(setGameLikes(responseDataResult.likes))
      const addView = await handleApiData(null, null, "patch", { plays: responseDataResult.plays + 1 })
      console.log('geting2')
      console.log(addView)
      return Promise.resolve('gameLoaded')
    } catch (e) {
      console.log(e)
      return Promise.resolve('gameLoadFailed')
    }
  }

  console.log('gameReRender')
  function elementDetect(number: string, specialProps: specialProps) {
    if (number == "0") {
      return "emptyElement"
    } else if (number == "1") {
      return "groundElement"
    } else if (number == "2") {
      return "lavaElement"
    } else if (number == "3") {
      if (specialProps?.collisionActive == true) {
        return "spikeElement"
      } else if (specialProps?.collisionActive == false) {
        return "emptyElement"
      } else {
        return "spikeElement"
      }
    } else if (number == "4") {
      return "goalElement"
    }
  }
  return (
    <div id="gameWrapper" ref={gameRef} className="gameWrapper content"  >
      <img className="fullWidth fullHeight noClick absolute pixelate topLeft" src="/images/background_sunset.png"></img>
      {characterHealth == 0 || gameWin ? "" : <HealthBar />}
      {characterHealth == 0 || gameWin ? "" : <Character ref={gameRef} />}
      <div id="gameGrid" className="gameGrid">
        {gameData.map((item, index) => { return <GameElement key={index} index={index} id={`element${index}`} ref={gameRef} class={elementDetect(item.type, item.specialProps)} /> })}
      </div>
      {(characterHealth == 0 || gameWin) && !rankView ? <GameResult /> : ""}
      {rankView ? <RankView /> : ""}
    </div>
  );
}

export default Game