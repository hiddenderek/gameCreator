import { store } from '../../src/app/store'
import { toggleGravity, changeX, changeY, jump, changeMoveAmount } from '../features/character/character-slice';
import { toggleSpace, toggleLeft, toggleRight, toggleCtrl, toggleZ, toggleY } from '../features/keyPress/keyPress-slice'
import { undo, redo } from '../features/gameData/gameData-slice'
import { refreshRate, jumpAmountRate, jumpDecreaseRate, jumpArcPeak} from './physicsConfig'
export let spaceLoop : NodeJS.Timeout
export let rightLoop : NodeJS.Timeout
export let leftLoop : NodeJS.Timeout

let jumpDecrease = 0
export function moveRight() {
    clearLeft()
    store.dispatch(toggleRight(true))
    rightLoop = setInterval(() => {
        const getNewStore = store.getState()
        if (getNewStore.character.x < 95.9 &&  !getNewStore.userInterface.rankView) {
            store.dispatch(changeX(getNewStore.character.moveAmount))
        }
    }, refreshRate)
}

export function moveLeft() {
    clearRight()
    store.dispatch(toggleLeft(true))
    leftLoop = setInterval(() => {
        const getNewStore = store.getState()
        if (getNewStore.character.x >= 0 && !getNewStore.userInterface.rankView) {
            store.dispatch(changeX(getNewStore.character.moveAmount * -1))
        }
    }, refreshRate)
}

export function clearRight(){
    store.dispatch(toggleRight(false))
    clearInterval(rightLoop)
}

export function clearLeft(){
    store.dispatch(toggleLeft(false))
    clearInterval(leftLoop)
}

export function moveJump(){
    store.dispatch(jump(true))
    store.dispatch(toggleSpace(true))

    spaceLoop = setInterval(() => {
        const getStore = store.getState()
        if (!getStore.userInterface.rankView) {
            //jump arc starts at -1.2 (negative is up) and gradually slows until it peaks at 0 and then starts going downward (positive)
            //limit is 1.2, then the jump arc stops
            jumpDecrease = jumpDecrease + jumpDecreaseRate
            let jumpAmount = jumpAmountRate + jumpDecrease
            // if the jump arc hasnt completed yet (< 1.2 and you havent released space yet (gravity is stopped), execute jump arc
            if (jumpAmount < jumpArcPeak && getStore.character.gravity === false) {
                store.dispatch(changeY(jumpAmount))
            } else if (jumpAmount >= jumpArcPeak) {
                //if you're still holding down space and havent released it yet, but the jump arc has completed, release the jump action.
                clearInterval(spaceLoop)
                store.dispatch(jump(false))
                store.dispatch(toggleGravity(true))
                jumpDecrease = 0
            }
        }
    }, refreshRate)
}

export function clearJump(){
    const getStore = store.getState()
    store.dispatch(toggleSpace(false))
    store.dispatch(jump(false))
    clearInterval(spaceLoop)
    jumpDecrease = 0
    if (getStore.character.gravity === false) {
        store.dispatch(toggleGravity(true))
    }
}

export function handleKeyPress(e: KeyboardEvent) {
    const targetElm = e.target as HTMLElement
    const getStore = store.getState()
    if (targetElm.tagName !== "INPUT") {
        if ((e!.key == "ArrowRight" || e!.key == "d") && getStore.keyPress.right == false) {
            moveRight()
        }
        if ((e!.key == "ArrowLeft" || e!.key == "a") && getStore.keyPress.left == false) {
            moveLeft()
        }
        if (e!.key == "ArrowUp" || e!.key == "w") {
        }
        if (e!.key == "ArrowDown" || e!.key == "s") {
        }
        if (e!.key == "z") {
            store.dispatch(toggleZ(true))
            if (getStore.keyPress.ctrl) {
                store.dispatch(undo())
            }
        }
        if (e!.key == "y") {
            store.dispatch(toggleY(true))
            if (getStore.keyPress.ctrl) {
                store.dispatch(redo())
            }
        }
        if (e.key == "Control") {
            store.dispatch(toggleCtrl(true))
            if (getStore.keyPress.z) {
                store.dispatch(undo())
            }
            if (getStore.keyPress.y) {
                store.dispatch(redo())
            }
        }
        //if you press the space key, and space key isnt already active, and gravity is not currently active, then trigger the jump arc. 
        if (e!.key == " " && jumpDecrease == 0 && !getStore.keyPress.space && getStore.character.gravity == false) {
            moveJump()
        }
    }
}

export function handleKeyRelease(e: KeyboardEvent) {
    const getStore = store.getState()
    if ((e!.key == "ArrowRight" || e!.key == "d") && getStore.keyPress.right == true) {
        clearRight()
    }
    if ((e!.key == "ArrowLeft" || e!.key == "a") && getStore.keyPress.left == true) {
        clearLeft()
    }
    if (e!.key == " ") {
        //if you release the space key cancel all jump related actions and turn back on gravity
        clearJump()
    }
    if (e!.key == "z") {
        store.dispatch(toggleZ(false))
    }
    if (e!.key == "y") {
        store.dispatch(toggleY(false))
    }
    if (e.key == "Control") {
        store.dispatch(toggleCtrl(false))
    }
}