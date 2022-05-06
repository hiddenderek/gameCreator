import React, { useRef, useEffect, useState, useReducer } from 'react';
import { useLocation } from 'react-router';
import {useAppDispatch, useAppSelector} from '../app/hooks'
import { toggleGravity, changeX, changeY, setY, jump } from '../features/character/character-slice';
import { store } from '../../src/app/store'
import e from 'express';
let jumpLoop: NodeJS.Timeout
let leftLoop: NodeJS.Timeout
let rightLoop: NodeJS.Timeout
let jumpDecrease = 0
function GameButtons() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const gravity = useAppSelector((state)=>state.character.gravity)
  const [buttonPressed, setButtonPressed] = useState('')
  const [jumpPressed, setJumpPressed] = useState(false)
  const [minimized, setMinimized] = useState(false)

  useEffect(()=>{
    if (buttonPressed === "dpadLeft") {
      clearInterval(rightLoop)
      leftLoop = setInterval(() => {
        const getNewStore = store.getState()
        if (getNewStore.character.x > 0 && !getNewStore.userInterface.rankView) {
          store.dispatch(changeX(-.8))
        }
      }, 33.333)
    } else if (buttonPressed === "dpadRight") {
      clearInterval(leftLoop)
      rightLoop = setInterval(() => {
        const getNewStore = store.getState()
        if (getNewStore.character.x < 95.9 && !getNewStore.userInterface.rankView) {
          store.dispatch(changeX(.8))
        }
      }, 33.333)
    } else if (!buttonPressed) {
      clearInterval(leftLoop)
      clearInterval(rightLoop)
    }
  }, [buttonPressed])

  useEffect(()=>{
    if (jumpPressed && jumpDecrease == 0 && gravity == false) {
      dispatch(jump(true))
      jumpLoop = setInterval(() => {
          const getStore = store.getState()
          if (!getStore.userInterface.rankView) {
              console.log('jump')
              //jump arc starts at -1.2 (negative is up) and gradually slows until it peaks at 0 and then starts going downward (positive)
              //limit is 1.2, then the jump arc stops
              jumpDecrease = jumpDecrease + .25
              let jumpAmount = -2.8 + jumpDecrease
              // if the jump arc hasnt completed yet (< 1.2 and you havent released space yet (gravity is stopped), execute jump arc
              if (jumpAmount < 2.8 && getStore.character.gravity === false) {
                  console.log('jumpmove')
                  store.dispatch(changeY(jumpAmount))
              } else if (jumpAmount >= 1.8) {
                  //if you're still holding down space and havent released it yet, but the jump arc has completed, release the jump action.
                  clearInterval(jumpLoop)
                  store.dispatch(jump(false))
                  store.dispatch(toggleGravity(true))
                  jumpDecrease = 0
              }
          }
      }, 33.333)
    } else if (!jumpPressed){
      clearInterval(jumpLoop)
      jumpDecrease = 0
      if (gravity === false) {
        dispatch(toggleGravity(true))
      }
      dispatch(jump(false))
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
      {location.pathname.includes('/gameEditor/') ? <div className = "fullWidth gameButtonMinimizer" onClick = {()=>{toggleMinimized()}}>{minimized ? "Maximize Buttons" : "Minimize Buttons"}</div> : "" }
      <div className = {`left ${location.pathname.includes('/gameEditor/') ? "gameEditorButtonHeight" : "fullHeight"} dpadContainer`}>
        <div className = "dpadButtonContainer">
          <input className = {`absolute pixelate noSelect dpadBtnUp ${buttonPressed === "dpadUp" ? "invert" : ""}`} type="image" src="/images/dPadUp.png" onPointerEnter = {(e)=>{setButtonPressed('dpadUp')}}  onPointerLeave = {(e)=>{setButtonPressed('')}}  onPointerUp = {(e)=>{setButtonPressed('')}}/>
          <input className = {`absolute pixelate noSelect dpadBtnDown ${buttonPressed === "dpadDown" ? "invert" : ""}`}  type="image" src="/images/dPadDown.png" onPointerEnter = {(e)=>{setButtonPressed('dpadDown')}} onPointerLeave = {(e)=>{setButtonPressed('')}} onPointerUp = {(e)=>{setButtonPressed('')}}/>
          <input className = {`absolute pixelate noSelect dpadBtnLeft ${buttonPressed === "dpadLeft" ? "invert" : ""}`}  type="image" src="/images/dPadLeft.png" onPointerEnter = {(e)=>{setButtonPressed('dpadLeft')}} onPointerLeave = {(e)=>{setButtonPressed('')}} onPointerUp = {(e)=>{setButtonPressed('')}}/>
          <input className = {`absolute pixelate noSelect dpadBtnRight ${buttonPressed === "dpadRight" ? "invert" : ""}`}  type="image" src="/images/dPadRight.png" onPointerEnter = {(e)=>{setButtonPressed('dpadRight')}} onPointerLeave = {(e)=>{setButtonPressed('')}} onPointerUp = {(e)=>{setButtonPressed('')}}/>
        </div>
      </div>
      <div className = {`right ${location.pathname.includes('/gameEditor/') ? "gameEditorButtonHeight" : "fullHeight"} jumpContainer`}>
          <div className = "jumpButtonContainer">
            <input className = {`absolute pixelate noSelect jumpBtn ${jumpPressed ? "invert" : ""}`}  type="image" src="/images/jump.png" onPointerEnter = {(e)=>{setJumpPressed(true)}} onPointerLeave = {(e)=>{setJumpPressed(false)}} onPointerUp = {(e)=>{setJumpPressed(false)}}/>
          </div>
      </div>
    </div>
  );
}

export default React.memo(GameButtons)