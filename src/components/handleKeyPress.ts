import { store } from '../../src/app/store'
import { toggleGravity, changeX, changeY, setY, jump, changeMoveAmount } from '../features/character/character-slice';
import { toggleSpace, toggleLeft, toggleRight, toggleCtrl, toggleZ, toggleY } from '../features/keyPress/keyPress-slice'
import { undo, redo } from '../features/gameData/gameData-slice'
import { event } from '../app/types'
export let spaceLoop : NodeJS.Timeout
export let rightLoop : NodeJS.Timeout
export let leftLoop : NodeJS.Timeout

let jumpDecrease = 0
export function handleKeyPress(e: event) {
    const getStore = store.getState()
    console.log(e)
    if (e!.target.tagName !== "INPUT") {
        if ((e!.key == "ArrowRight" || e!.key == "d") && getStore.keyPress.right == false) {
            console.log("Left")
            store.dispatch(toggleRight(true))
            store.dispatch(changeMoveAmount(.8))
            rightLoop = setInterval(() => {
                const getNewStore = store.getState()
                if (getNewStore.character.x < 95.9 &&  !getNewStore.userInterface.rankView) {
                    store.dispatch(changeX(getNewStore.character.moveAmount))
                }
            }, 33.333)
        }
        if ((e!.key == "ArrowLeft" || e!.key == "a") && getStore.keyPress.left == false) {
            console.log("Right")
            store.dispatch(toggleLeft(true))
            store.dispatch(changeMoveAmount(.8))
            leftLoop = setInterval(() => {
                const getNewStore = store.getState()
                if (getNewStore.character.x >= 0 && !getNewStore.userInterface.rankView) {
                    store.dispatch(changeX(getNewStore.character.moveAmount * -1))
                }
            }, 33.333)
        }
        if (e!.key == "ArrowUp" || e!.key == "w") {
            console.log("Up")
        }
        if (e!.key == "ArrowDown" || e!.key == "s") {
            console.log("Down")
        }
        if (e!.key == "z") {
            store.dispatch(toggleZ(true))
            if (getStore.keyPress.ctrl) {
                console.log('undoing things!')
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
        console.log(getStore.keyPress.space)
        //if you press the space key, and space key isnt already active, and gravity is not currently active, then trigger the jump arc. 
        if (e!.key == " " && jumpDecrease == 0 && !getStore.keyPress.space && getStore.character.gravity == false) {
            store.dispatch(jump(true))
            store.dispatch(toggleSpace(true))

            spaceLoop = setInterval(() => {
                const getStore = store.getState()
                if (!getStore.userInterface.rankView) {
                    console.log('jump')
                    //jump arc starts at -1.2 (negative is up) and gradually slows until it peaks at 0 and then starts going downward (positive)
                    //limit is 1.2, then the jump arc stops
                    jumpDecrease = jumpDecrease + .25
                    let jumpAmount = -2.8 + jumpDecrease
                    // if the jump arc hasnt completed yet (< 1.2 and you havent released space yet (gravity is stopped), execute jump arc
                    if (jumpAmount < 1.8 && getStore.character.gravity === false) {
                        console.log('jumpmove')
                        store.dispatch(changeY(jumpAmount))
                    } else if (jumpAmount >= 1.8) {
                        //if you're still holding down space and havent released it yet, but the jump arc has completed, release the jump action.
                        clearInterval(spaceLoop)
                        store.dispatch(jump(false))
                        store.dispatch(toggleGravity(true))
                        jumpDecrease = 0
                    }
                }
            }, 33.333)
        }
    }
}

export function handleKeyRelease(e: event) {
    const getStore = store.getState()
    if ((e!.key == "ArrowRight" || e!.key == "d") && getStore.keyPress.right == true) {
        console.log("Right")
        store.dispatch(toggleRight(false))
        clearInterval(rightLoop)
    }
    if ((e!.key == "ArrowLeft" || e!.key == "a") && getStore.keyPress.left == true) {
        console.log("Left")
        store.dispatch(toggleLeft(false))
        clearInterval(leftLoop)
    }
    if (e!.key == " ") {
        //if you release the space key cancel all jump related actions and turn back on gravity
        store.dispatch(toggleSpace(false))
        store.dispatch(jump(false))
        clearInterval(spaceLoop)
        jumpDecrease = 0
        if (getStore.character.gravity === false) {
            store.dispatch(toggleGravity(true))
        }
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