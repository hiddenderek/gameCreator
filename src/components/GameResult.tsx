import React from 'react';
import {useAppSelector } from '../app/hooks';

function GameResult() {
  const characterHealth = useAppSelector((state) => state.character.health)
  const playTimeSeconds = useAppSelector((state) => state.gameEvents.playTimeSeconds)
  const playTimeMinutes = useAppSelector((state) => state.gameEvents.playTimeMinutes)
  const playTimeHours = useAppSelector((state) => state.gameEvents.playTimeHours)
  const gameWin = useAppSelector((state) => state.gameEvents.winGame)

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
      
