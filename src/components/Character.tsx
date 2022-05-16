import React, { useEffect } from 'react';;
import { useAppSelector } from '../app/hooks';
import { useLocation } from 'react-router-dom'
import {characterTrack, clearCharacterTrack} from '../utils/physics'
import {resetGame} from './GameEvents'

function Character (props: any, ref: any) {
  const location = useLocation()
  const character = useAppSelector((state) => state.character)
  // manages collision for character

  // manages gravity for character if the gravity property on the character is true
  //calls collision management and gravity management 60 times per second
  useEffect(() => {
      clearCharacterTrack()
      resetGame()
      characterTrack(ref)
  },[location.pathname])

  return (
    <div id="character" className={`${character.jump ? "characterJump" : "character"} ${character.health < 7 &&  character.health >= 4 ? "characterLightDamage" : character.health < 4 && character.health> 1 ? "characterMediumDamage" : character.health == 1 ? "characterHighDamage" : null}`} style={{ transform: `translate(${character.x * 32}%, ${character.y * (character.jump ? 7.2 : 9)}%) ${character.direction == "left" ? "scaleX(-1)" : "scaleX(1)"}`}}>
    </div>
  );
}

const gameRef = React.forwardRef(Character)
export default gameRef