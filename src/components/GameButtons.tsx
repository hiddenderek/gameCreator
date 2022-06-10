import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useAppSelector} from '../app/hooks'
import { clearJump, clearLeft, clearRight, moveJump, moveLeft, moveRight } from '../utils/handleKeyPress';

let jumpDecrease = 0

function GameButtons() {
  const location = useLocation()
  const gravity = useAppSelector((state)=>state.character.gravity)
  const [buttonPressed, setButtonPressed] = useState('')
  const [jumpPressed, setJumpPressed] = useState(false)
  const [minimized, setMinimized] = useState(false)

  useEffect(()=>{
    if (buttonPressed === "dpadRight") {
      clearLeft()
      moveRight()
    } else if (buttonPressed === "dpadLeft") {
      clearRight()
      moveLeft()
    } else if (!buttonPressed) {
      clearRight()
      clearLeft()
    }
  }, [buttonPressed])

  useEffect(()=>{
    if (jumpPressed && jumpDecrease == 0 && gravity == false) {
      moveJump()
    } else if (!jumpPressed){
      clearJump()
    }
  }, [jumpPressed])

  function toggleMinimized() {
    if (minimized === false) {
      setMinimized(true)
    } else if (minimized === true) {
      setMinimized(false)
    }
  }

  return (
    <div id = "gameButtonContainer" className={`absolute fullWidth gameButtonContainer ${minimized ? "gameButtonsMimized" : ""}`} onContextMenu = {(e)=>{e.preventDefault()}}>
      {location.pathname.includes('/gameEditor/') ? <div data-testid = "game_button_minimizer" className = "fullWidth gameButtonMinimizer" onClick = {()=>{toggleMinimized()}}>{minimized ? "Maximize Buttons" : "Minimize Buttons"}</div> : "" }
      <div className = {`left ${location.pathname.includes('/gameEditor/') ? "gameEditorButtonHeight" : "fullHeight"} dpadContainer`}>
        <div className = "dpadButtonContainer">
          <input data-testid = "game_button_up" className = {`absolute pixelate noSelect dpadBtnUp ${buttonPressed === "dpadUp" ? "invert" : ""}`} type="image" src="/images/dPadUp.png" onPointerEnter = {(e)=>{setButtonPressed('dpadUp')}}  onPointerLeave = {(e)=>{setButtonPressed('')}}  onPointerUp = {(e)=>{setButtonPressed('')}}/>
          <input data-testid = "game_button_down" className = {`absolute pixelate noSelect dpadBtnDown ${buttonPressed === "dpadDown" ? "invert" : ""}`}  type="image" src="/images/dPadDown.png" onPointerEnter = {(e)=>{setButtonPressed('dpadDown')}} onPointerLeave = {(e)=>{setButtonPressed('')}} onPointerUp = {(e)=>{setButtonPressed('')}}/>
          <input data-testid = "game_button_left" className = {`absolute pixelate noSelect dpadBtnLeft ${buttonPressed === "dpadLeft" ? "invert" : ""}`}  type="image" src="/images/dPadLeft.png" onPointerEnter = {(e)=>{setButtonPressed('dpadLeft')}} onPointerLeave = {(e)=>{setButtonPressed('')}} onPointerUp = {(e)=>{setButtonPressed('')}}/>
          <input data-testid = "game_button_right" className = {`absolute pixelate noSelect dpadBtnRight ${buttonPressed === "dpadRight" ? "invert" : ""}`}  type="image" src="/images/dPadRight.png" onPointerEnter = {(e)=>{setButtonPressed('dpadRight')}} onPointerLeave = {(e)=>{setButtonPressed('')}} onPointerUp = {(e)=>{setButtonPressed('')}}/>
        </div>
      </div>
      <div className = {`right ${location.pathname.includes('/gameEditor/') ? "gameEditorButtonHeight" : "fullHeight"} jumpContainer`}>
          <div className = "jumpButtonContainer">
            <input data-testid = "game_button_jump" className = {`absolute pixelate noSelect jumpBtn ${jumpPressed ? "invert" : ""}`}  type="image" src="/images/jump.png" onPointerEnter = {(e)=>{setJumpPressed(true)}} onPointerLeave = {(e)=>{setJumpPressed(false)}} onPointerUp = {(e)=>{setJumpPressed(false)}}/>
          </div>
      </div>
    </div>
  );
}

export default React.memo(GameButtons)