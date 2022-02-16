import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NumberLiteralType, walkUpBindingElementsAndPatterns } from 'typescript';

interface gameDataState {
    spikeStatus: boolean
    winGame: boolean
    timer: number
    playTimeSeconds: number
    playTimeMinutes: number
    playTimeHours: number
}
const initialState: gameDataState = {
    spikeStatus: false,
    winGame: false,
    timer: 0,
    playTimeSeconds: 0,
    playTimeMinutes: 0,
    playTimeHours: 0
}

const gameEventsSlice = createSlice({
    name: "gameEvent",
    initialState,
    reducers: {
        eventReset: () => { 
            return initialState
        },
        toggleSpikeStatus(state, action: PayloadAction<boolean>) {
            state.spikeStatus = action.payload
        },
        countTime(state) {
            state.timer = state.timer + 1
        },
        evalTime(state) {
            if (state.playTimeSeconds === 0 && state.playTimeMinutes === 0 && state.playTimeHours === 0) {
                console.log(state.timer)
                state.playTimeSeconds = state.timer
                if (state.timer > 60) {
                    state.playTimeMinutes = state.timer / 60
                }
                if (state.playTimeMinutes > 1) {
                    state.playTimeSeconds = Number(((state.playTimeMinutes % 1) * 60).toFixed(1))
                }
                if (state.playTimeMinutes > 60) {
                    state.playTimeHours = Math.round((state.playTimeMinutes / 60))
                    state.playTimeSeconds = Number((((state.playTimeMinutes / 60) % 1) * 3600).toFixed(1))
                }
                console.log(state.playTimeSeconds)
                console.log(state.playTimeMinutes)
                console.log(state.playTimeHours)
            }
        },
        winGame(state) {
            state.winGame = true
        }
    }
})

export const { eventReset, toggleSpikeStatus, countTime, evalTime, winGame } = gameEventsSlice.actions
export default gameEventsSlice.reducer;