import { store } from '../../src/app/store'
import { eventReset, toggleSpikeStatus, countTime } from '../features/gameEvents/gameEvents-slice';
import { gameEditorReset } from '../features/gameEditor/gameEditor-slice'
import { gameReset } from '../features/gameData/gameData-slice';
import { characterReset } from '../features/character/character-slice';
import { clearCharacterTrack } from '../utils/physics'
let spikeAlternater: NodeJS.Timer | undefined
let timeCounter: NodeJS.Timer | undefined
typeof window != "undefined" ? window.addEventListener("popstate", (e) => { clearInterval(spikeAlternater as NodeJS.Timer); clearInterval(timeCounter as NodeJS.Timer) }) : ""

export function spikeAlternate() {
    if (!spikeAlternater) {
        spikeAlternater = setInterval(() => {
            const getStore = store.getState()
            console.log('alternateSpike')
            if (getStore.gameEvents.spikeStatus == true) {
                store.dispatch(toggleSpikeStatus(false))
            } else if (getStore.gameEvents.spikeStatus == false) {
                store.dispatch(toggleSpikeStatus(true))
            }
        }, 4000)
    }
}
export function timeCount() {
    if (!timeCounter) {
        timeCounter = setInterval(() => {
            console.log('countTime')
            const getStore = store.getState()
            if (!getStore.userInterface.rankView) {
                store.dispatch(countTime())
            }
        }, 1000)
    }
}

export function clearCounts() {
    clearInterval(spikeAlternater as NodeJS.Timer)
    spikeAlternater = undefined
    clearInterval(timeCounter as NodeJS.Timer)
    timeCounter = undefined
}

export function resetGame() {
    const getStore = store.getState()
    store.dispatch(gameReset())
    store.dispatch(gameEditorReset())
    store.dispatch(characterReset())
    store.dispatch(eventReset())
    clearCounts()
    clearCharacterTrack()
    characterReset()
}