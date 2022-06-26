import { store } from '../app/store'
import { spaceLoop } from './handleKeyPress';
import { toggleGravity, changeY, setY, setX, jump, removeHealth, changeMoveAmount } from '../features/character/character-slice';
import { toggleSpace } from '../features/keyPress/keyPress-slice'
import { evalTime, winGame } from '../features/gameEvents/gameEvents-slice'
import { clearCounts } from '../components/GameEvents'
import { refreshRate, moveRate, gravityRate} from './physicsConfig'

let characterLoop: NodeJS.Timeout
let lavaCount = 0
let spikeCount = 0

typeof window != "undefined" ? window.addEventListener("popstate", (e) => { clearInterval(characterLoop) }) : ""
export function gravityManage(action: boolean) {
    store.dispatch(toggleGravity(action))
    const getStore = store.getState()
    if (getStore.character.gravity == true && !getStore.userInterface.rankView) {
        store.dispatch(changeY(gravityRate))
    }
}

export function characterTrack(ref: any) {
    characterLoop = setInterval(() => {
        const getStore = store.getState()
        if (!getStore.userInterface.rankView) {
            const character = getStore.character
            const gameData = getStore.gameData.gameData
            const eventData = getStore.gameData.eventData
            // the screen can be any size so we need to set an initial size to compare it to to get proper percentages 
            // for the X/Y location of each game element on screen
            const initialGameWidth = 1920
            const initialGameHeight = 1080
            //measure the parent component (game wrapper) size to get the percentage difference from the initial size
            const curGameMeasure = ref?.current?.getBoundingClientRect()
            const curGameWidth = curGameMeasure?.width
            const curGameHeight = curGameMeasure?.height
            //calculate the percentage difference to adjust the game elements location properly
            const gameWidthAdjust = curGameWidth / initialGameWidth
            const gameHeightAdjust = curGameHeight / initialGameHeight
            //we need to check if the location of the character is on a game element with collision enabled, so we need to 
            //retrieve the area on screen that the character is located in to compare to. Dont want to compare all 576 tiles each frame. This is calculated by getting the
            //characters location (a percentage) and then multiplying that percentage by the number of squares on screen and rounding to the nearest integer.
            //For height there is 18 tiles, for width that is 32. So multiplying by percentage will get you the row/column info of the tile grid.
            //For height, the character is 2 blocks high so we're offseting that by 2 to get the bottom of the character as a reference. 
            const positionY = Math.round(((character.y / 100) * 18)) + 2
            //Y1 calculates the position to be tracked 1 block up from the bottom of the character
            const positionY1 = Math.round(((character.y / 100) * 18)) + 1
            //Y0 calculates the position to be tracked 1 block above the character
            const positionY0 = Math.round(((character.y / 100) * 18))
            const positionX = Math.floor((character.x / 100) * 32)
            const positionX2 = Math.ceil((character.x / 100) * 32)
            const positionXLeft = Math.ceil((character.x / 100) * 32) - 1
            const positionXRight = Math.floor((character.x / 100) * 32) + 1
            //this gets the 3 elements directly left of the character
            const gameElmLocationLeft1 = positionXLeft + ((positionY1) * 32)
            const gameElmLocationLeft2 = positionXLeft + ((positionY0) * 32)
            const gameElmLocationLeft3 = positionXLeft + ((positionY) * 32)
            //this gets the 3 elements directly right of the character
            const gameElmLocationRight1 = positionXRight + ((positionY1) * 32)
            const gameElmLocationRight2 = positionXRight + ((positionY0) * 32)
            const gameElmLocationRight3 = positionXRight + ((positionY) * 32)
            //this gets the two elements above the character
            const gameElmLocationTop1 = positionX + (positionY0 * 32)
            const gameElmLocationTop2 = positionX2 + (positionY0 * 32)
            //this gets the exact game element index in the array of game elements by multiplying the rows (32 long) and then adding the column locaiton in that row
            const gameElmLocation1 = positionX + (positionY * 32)
            const gameElmLocation2 = positionX2 + (positionY * 32)
            //this is the game element 1 block up from the bottom of the character, for elements that need to be tracked but arent necessarily having collision
            const gameElmLocation3 = positionX + ((positionY1) * 32)
            const gameElmLocation4 = positionX2 + ((positionY1) * 32)
            //if all tracked game element array items exist and the character is not less than X 0 or greater than Y 18 (boundaries of the grid), evaluate physics. 
            if (positionY <= 18) {
                if (((gameData[gameElmLocation1]?.collision && (eventData[gameElmLocation1]?.collisionActive === undefined ? true : eventData[gameElmLocation1].collisionActive)) ||
                    (gameData[gameElmLocation2]?.collision && (eventData[gameElmLocation2]?.collisionActive === undefined ? true : eventData[gameElmLocation2].collisionActive)))) {
                    //if the game element exists and there is a collision property, get the percentage Y location of the collision element 
                    //and compare it to the characters percentage location. Offset it by 11% (height of the character)
                    let gameCollisionPercent: number = 0
                    if (gameData[gameElmLocation1]?.collision) {
                        gameCollisionPercent = (((gameData[gameElmLocation1].collision.top * gameHeightAdjust) / curGameHeight) * 100) - 11.111
                    }
                    if (gameData[gameElmLocation2]?.collision) {
                        gameCollisionPercent = (((gameData[gameElmLocation2].collision.top * gameHeightAdjust) / curGameHeight) * 100) - 11.111
                    }
                    if (((gameCollisionPercent) <= (character.y))) {
                        if (getStore.character.gravity === true) {
                            // if the character Y % is past the collision elements Y % then stop gravity and set the character Y % to the collision elements Y %
                            gravityManage(false)
                        }
                        store.dispatch(setY(gameCollisionPercent))
                    } else if (!((gameCollisionPercent) <= (character.y)) && character.jump === false) {
                        gravityManage(true)
                    }

                } else if (character.jump === false) {
                    gravityManage(true)
                }
                if (gameData[gameElmLocationTop1]?.type == "1" || gameData[gameElmLocationTop2]?.type == "1") {
                    if (character.jump === true) {
                        store.dispatch(jump(false))
                        store.dispatch(toggleSpace(false))
                        clearInterval(spaceLoop)
                    }
                }
                if ((gameData[gameElmLocationLeft1]?.type == "1" || gameData[gameElmLocationLeft2]?.type == "1") && (gameData[gameElmLocationTop1]?.type == "0" || gameData[gameElmLocationTop2]?.type == "0") && getStore.keyPress.left) {
                    store.dispatch(changeMoveAmount(0))
                    let gameCollisionPercent: number = 0
                    if (gameData[gameElmLocationLeft1]?.collision) {
                        gameCollisionPercent = (((gameData[gameElmLocationLeft1].collision.right * gameWidthAdjust) / curGameWidth) * 100)
                    }
                    if (gameData[gameElmLocationLeft2]?.collision) {
                        gameCollisionPercent = (((gameData[gameElmLocationLeft2].collision.right * gameWidthAdjust) / curGameWidth) * 100)
                    }
                    store.dispatch(setX((gameCollisionPercent + .1)))
                    if (gameData[gameElmLocationLeft3]?.type == "0") {
                        store.dispatch(jump(false))
                        store.dispatch(toggleSpace(false))
                        clearInterval(spaceLoop)
                    }
                } else if ((gameData[gameElmLocationLeft1]?.type == "0" || gameData[gameElmLocationLeft2]?.type == "0")) {
                    store.dispatch(changeMoveAmount(moveRate))
                }
                if ((gameData[gameElmLocationRight1]?.type == "1" || gameData[gameElmLocationRight2]?.type == "1") && (gameData[gameElmLocationTop1]?.type == "0" || gameData[gameElmLocationTop2]?.type == "0") && getStore.keyPress.right) {
                    store.dispatch(changeMoveAmount(0))
                    let gameCollisionPercent: number = 0
                    if (gameData[gameElmLocationRight1]?.collision) {
                        gameCollisionPercent = (((gameData[(gameElmLocationRight1)].collision.left * gameWidthAdjust) / curGameWidth) * 100)
                    }
                    if (gameData[gameElmLocationRight2]?.collision) {
                        gameCollisionPercent = (((gameData[(gameElmLocationRight2)].collision.left * gameWidthAdjust) / curGameWidth) * 100)
                    }
                    store.dispatch(setX((gameCollisionPercent - 3.3)))
                    if (gameData[gameElmLocationRight3]?.type == "0") {
                        store.dispatch(jump(false))
                        store.dispatch(toggleSpace(false))
                        clearInterval(spaceLoop)
                    }
                } else if ((gameData[gameElmLocationRight1]?.type == "0" || gameData[gameElmLocationRight2]?.type == "0")) {
                    store.dispatch(changeMoveAmount(moveRate))
                }
                //actions for type 2 of game element.
                if (gameData[gameElmLocation1]?.type == "2" || gameData[gameElmLocation2]?.type == "2") {
                    lavaCount++
                    if (lavaCount > 1) {
                        store.dispatch(removeHealth(1))
                        lavaCount = 0
                    }
                } else {
                    lavaCount = 0
                }
                //actions for type 3 of game element
                if ((gameData[gameElmLocation1]?.type == "3" || gameData[gameElmLocation2]?.type == "3" || gameData[gameElmLocation3]?.type == "3" || gameData[gameElmLocation4]?.type == "3") &&
                    ((eventData[gameElmLocation1]?.collisionActive) ||
                        (eventData[gameElmLocation2]?.collisionActive) ||
                        (eventData[gameElmLocation3]?.collisionActive) ||
                        (eventData[gameElmLocation4]?.collisionActive))
                ) {
                    spikeCount++
                    if (spikeCount > 3) {
                        store.dispatch(removeHealth(1))
                        spikeCount = 0
                    }
                } else {
                    spikeCount = 0
                }
                //actions for type 4 of game element
                if ((gameData[gameElmLocation1]?.type == "4" || gameData[gameElmLocation2]?.type == "4") && location.pathname.includes('/games/')) {
                    store.dispatch(evalTime())
                    store.dispatch(winGame())
                    clearCounts()
                }
            } else if ((positionY > 18) && location.pathname.includes('/games/')) {
                store.dispatch(removeHealth(10))
                clearCounts()
            }
        }
    }, refreshRate)
}

export function clearCharacterTrack() {
    clearInterval(characterLoop)
}