declare const window: Window & { gameAudio : any }
import React, { useRef, useEffect, useState, useReducer } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loadGame, setGameLoaded, setGameName, setGameLikes, setGameSize } from '../features/gameData/gameData-slice';
import GameElement from './GameElement'
import Character from './Character'
import HealthBar from './HealthBar'
import GameResult from './GameResult'
import RankView from './RankView'
import GameButtons from './GameButtons'
import { spikeAlternate, timeCount, resetGame } from './GameEvents';
import { characterReset } from '../features/character/character-slice';
import { setRankView } from '../features/userInterface/userInterface-slice';
import { useLocation } from 'react-router'
import { handleApiData } from './Apicalls';
import { userObject } from '../app/types'


function Game({ profileData, aspectRatio, isMobile }: { profileData: userObject, aspectRatio: number, isMobile: boolean }) {
  const gameData: elementObj[] = useAppSelector((state) => state.gameData.gameData)
  const characterHealth = useAppSelector((state) => state.character.health)
  const gameWin = useAppSelector((state) => state.gameEvents.winGame)
  const gameLoaded = useAppSelector((state) => state.gameData.gameLoaded)
  const timePlayed = useAppSelector((state) => state.gameEvents.timer)
  const rankView = useAppSelector((state) => state.userInterface.rankView)
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
    setTimeout(() => {
      dispatch(setRankView(false))
      dispatch(setGameSize({ width: gameGet?.width, height: gameGet?.height }))
      getGameData()
    }, location.pathname.includes('/gameEditor/') ? 100 : 0)
  }, [location.pathname])
  useEffect(() => {
    if (gameWin === true) {
      console.log('posting score!')
      handleApiData(`${location.pathname}/scores/${profileData.username}`, null, "post", { score: timePlayed })
    }
    const audio = window?.gameAudio?.gameMusic_1
    if (audio) {
      if (gameWin || characterHealth <= 0 || rankView) {
        audio.pause()
      } else {
        audio.play()
      }
    }
  }, [gameWin, characterHealth, rankView])

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
      if (responseDataResult?.data) {
        const gameParse = typeof responseDataResult?.data === "string" ? JSON.parse(responseDataResult?.data) : responseDataResult?.data
        dispatch(loadGame(gameParse?.game_data[gameScreen]?.gameData))
        dispatch(setGameName(gameParse?.game_name))
        dispatch(setGameLikes(gameParse?.likes))
        const addView = await handleApiData(null, null, "patch", { plays: gameParse?.plays + 1 })
        console.log('geting2')
        console.log(addView)
        dispatch(characterReset())
        spikeAlternate()
        timeCount()
        dispatch(setGameLoaded())
      }
      return Promise.resolve('gameLoaded')
    } catch (e) {
      console.log(e)
      return Promise.resolve('gameLoadFailed')
    }
  }

  console.log('gameReRender')

  return (
    <div className="gameContent">
      <div id="gameWrapper" ref={gameRef} className="gameWrapper"  >
        <img className="fullWidth fullHeight noClick absolute pixelate topLeft" src="/images/background_sunset.png"></img>
        {((characterHealth == 0 || gameWin) || location.pathname.includes('/gameEditor/')) || !gameLoaded ? "" : <p className="absolute topRight timerFont">{timePlayed}</p>}
        {characterHealth == 0 || gameWin ? "" : <HealthBar />}
        {characterHealth == 0 || gameWin ? "" : <Character ref={gameRef} />}
        <div id="gameGrid" className="gameGrid">
          {gameData.map((item, index) => { return <GameElement key={`element${index}`} index={index} id={`element${index}`} ref={gameRef}  /> })}
        </div>
        {(characterHealth == 0 || gameWin) && !rankView && (!isMobile)? <GameResult /> : ""}
        {!gameLoaded ? <div className="fullHeight fullWidth topLeft absolute flexCenter gameWin">Loading...</div> : ""}
        {rankView && (aspectRatio >= 1) ? <RankView profileData={profileData} /> : ""}
      </div>
      {(characterHealth == 0 || gameWin) && !rankView && (isMobile)? <GameResult /> : ""}
      {rankView && (aspectRatio < 1) ? <RankView profileData={profileData} /> : ""}
      {isMobile && !rankView && characterHealth > 0 && !gameWin ? <GameButtons /> : ""}
    </div>
  );
}

export default Game