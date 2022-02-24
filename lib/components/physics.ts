import { store } from '../../lib/app/store'
import { toggleGravity, changeY, setY, removeHealth } from '../features/character/character-slice';
import { evalTime, winGame } from '../features/gameEvents/gameEvents-slice'
import { clearCounts } from './GameEvents'
let gravityLoop: NodeJS.Timeout
let characterLoop: NodeJS.Timeout
let lavaCount = 0
let spikeCount = 0

typeof window != "undefined" ? window.addEventListener("popstate", (e) => { clearInterval(characterLoop) }) : ""
export function gravityManage(action: boolean) {
    store.dispatch(toggleGravity(action))
    const getStore = store.getState()
    if (getStore.character.gravity == true && !getStore.userInterface.rankView) {
        store.dispatch(changeY(1.2))
    }
}

export function characterTrack(ref: any) {
    characterLoop = setInterval(() => {
        const getStore = store.getState()
        if (!getStore.userInterface.rankView) {
            const character = getStore.character
            const gameData = getStore.gameData.gameData
            // the screen can be any size so we need to set an initial size to compare it to to get proper percentages 
            // for the X/Y location of each game element on screen
            let initialGameWidth = 1920
            let initialGameHeight = 1080
            //measure the parent component (game wrapper) size to get the percentage difference from the initial size
            let curGameMeasure = ref?.current?.getBoundingClientRect()
            let curGameWidth = curGameMeasure?.width
            let curGameHeight = curGameMeasure?.height
            //calculate the percentage difference to adjust the game elements location properly
            let gameWidthAdjust = curGameWidth / initialGameWidth
            let gameHeightAdjust = curGameHeight / initialGameHeight
            //we need to check if the location of the character is on a game element with collision enabled, so we need to 
            //retrieve the area on screen that the character is located in to compare to. Dont want to compare all 576 tiles each frame. This is calculated by getting the
            //characters location (a percentage) and then multiplying that percentage by the number of squares on screen and rounding to the nearest integer.
            //For height there is 18 tiles, for width that is 32. So multiplying by percentage will get you the row/column info of the tile grid.
            //For height, the character is 2 blocks high so we're offseting that by 2 to get the bottom of the character as a reference. 
            let positionY = Math.round(((character.y / 100) * 18)) + 2
            //Y1 calculates the position to be tracked 1 block up from the bottom of the character
            let positionY1 = Math.round(((character.y / 100) * 18)) + 1
            let positionX = Math.floor((character.x / 100) * 32)
            let positionX2 = Math.ceil((character.x / 100) * 32)
            //this gets the exact game element index in the array of game elements by multiplying the rows (32 long) and then adding the column locaiton in that row
            let gameElmLocation1 = positionX + (positionY * 32)
            let gameElmLocation2 = positionX2 + (positionY * 32)
            //this is the game element 1 block up from the bottom of the character, for elements that need to be tracked but arent necessarily having collision
            let gameElmLocation3 = positionX + ((positionY1) * 32)
            let gameElmLocation4 = positionX2 + ((positionY1) * 32)
            //if all tracked game element array items exist and the character is not less than X 0 or greater than Y 18 (boundaries of the grid), evaluate physics. 
            if (positionY <= 18) {
                if (((gameData[gameElmLocation1]?.collision && (gameData[gameElmLocation1]?.specialProps?.collisionActive === undefined ? true : gameData[gameElmLocation1].specialProps.collisionActive)) ||
                    (gameData[gameElmLocation2]?.collision && (gameData[gameElmLocation2]?.specialProps?.collisionActive === undefined ? true : gameData[gameElmLocation2].specialProps.collisionActive)))) {
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
                //actions for type 2 of game element.
                if (gameData[gameElmLocation1]?.type == "2" || gameData[gameElmLocation2]?.type == "2") {
                    lavaCount++
                    if (lavaCount > 1) {
                        console.log('lava!!!!')
                        store.dispatch(removeHealth(1))
                        lavaCount = 0
                    }
                } else {
                    lavaCount = 0
                }
                //actions for type 3 of game element
                if ((gameData[gameElmLocation1]?.type == "3" || gameData[gameElmLocation2]?.type == "3" || gameData[gameElmLocation3]?.type == "3" || gameData[gameElmLocation4]?.type == "3") &&
                    ((gameData[gameElmLocation1]?.specialProps?.collisionActive) ||
                        (gameData[gameElmLocation2]?.specialProps?.collisionActive) ||
                        (gameData[gameElmLocation3]?.specialProps?.collisionActive) ||
                        (gameData[gameElmLocation4]?.specialProps?.collisionActive))
                ) {
                    spikeCount++
                    if (spikeCount > 3) {
                        console.log('spike!!')
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
    }, 16.666)
}

export function clearCharacterTrack() {
    clearInterval(characterLoop)
}