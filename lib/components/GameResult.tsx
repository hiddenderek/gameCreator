import React, { useRef, useEffect, useState, useReducer } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {loadGame, setGameName, setGameLikes, setGameSize } from '../features/gameData/gameData-slice';
import { resetGame, spikeAlternate, timeCount } from './GameEvents';
import { useLocation } from 'react-router'
import { handleApiData } from './Apicalls';
import { characterTrack } from './physics';
;
function GameResult() {
  const characterHealth = useAppSelector((state) => state.character.health)
  const playTimeSeconds = useAppSelector((state) => state.gameEvents.playTimeSeconds)
  const playTimeMinutes = useAppSelector((state) => state.gameEvents.playTimeMinutes)
  const playTimeHours = useAppSelector((state) => state.gameEvents.playTimeHours)
  const gameWin = useAppSelector((state) => state.gameEvents.winGame)
  const gameRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`fullHeight fullWidth topLeft absolute flexCenter flexDirColumn ${gameWin ? "gameWin" : characterHealth == 0 ? "gameLose" : ""}`}>
      <span className = 'gameTextContainer'>
        <div className="gameText" >{characterHealth == 0 ? "Game Over" : gameWin ? `You Win!` : ""}</div>
      </span>
      {gameWin ?
        <span className = "gameStatText">{`Playtime: ${playTimeMinutes === 0 && playTimeHours == 0 ? `${playTimeSeconds} second${playTimeSeconds < 2 ? "" : "s"}.` :
          playTimeHours === 0 ? `${Math.round(playTimeMinutes)} minute${playTimeMinutes < 2 ? "" : "s"}, ${playTimeSeconds} second${playTimeSeconds < 2 ? "" : "s"}.` :
            `${Math.round(playTimeHours)} hour${playTimeHours < 2 ? "" : "s"}, ${playTimeMinutes} minute${playTimeMinutes < 2 ? "" : "s"}, ${playTimeSeconds} second${playTimeSeconds < 2 ? "" : "s"}.`}`}
        </span>
        : ""}
      <form className = "retryContainer flexCenter">
        <button className="retryButton">{characterHealth == 0 ? "Try Again?" : gameWin ? "Play Again?" : ""}</button>
      </form>
    </div>
  );
}

export default GameResult
      
