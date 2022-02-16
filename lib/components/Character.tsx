import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleGravity, changeY, setY } from '../features/character/character-slice';
import {gravityManage, characterTrack, clearCharacterTrack} from './physics'
function Character (props: any, ref: any) {
  const character = useAppSelector((state) => state.character)

  // manages collision for character


  // manages gravity for character if the gravity property on the character is true
  //calls collision management and gravity management 60 times per second
  useEffect(() => {
    console.log('track!')
      clearCharacterTrack()
      characterTrack(ref)
  },[])
  return (
    <div id="character" className={`${character.jump ? "characterJump" : "character"} ${character.health < 7 &&  character.health >= 4 ? "characterLightDamage" : character.health < 4 && character.health> 1 ? "characterMediumDamage" : character.health == 1 ? "characterHighDamage" : null}`} style={{ transform: `${character.direction == "left" ? "scaleX(-1)" : "scaleX(1)"}`, top: `${character.y}%`, left: `${character.x}%`}}>
    </div>
  );
}

const gameRef = React.forwardRef(Character)
export default gameRef