import {createSlice, PayloadAction} from '@reduxjs/toolkit'; 

interface gameDataState {
    gameLoaded: boolean,
    gameData: elementObj[],
    eventData: eventObj[],
    gameName: string,
    gameLikes: number,
    gameSize: gameSizeObj
}
interface modifyGame {
    index: number,
    property: string,
    modifier: any,
    record: boolean
}
interface elementObj {
    type: string
    [key: string]: any
}
interface eventObj {
    collisionActive?: boolean 
    [key: string]: any
}
interface gameSizeObj {
    width: number | undefined
    height: number | undefined
}
const initialState: gameDataState = {
    gameLoaded: false,
    gameData: [],
    eventData: [],
    gameName: '',
    gameLikes: 0,
    gameSize: {width: 0, height: 0}
}
let historyCycle = 0
export let gameHistory : gameDataState[] = []
const gameDataSlice = createSlice({
    name: "gameData",
    initialState,
    reducers: {
        gameReset: () => { 
            historyCycle = 0
            gameHistory = []
            return initialState 
        },
        loadGame(state, action: PayloadAction<elementObj[]>) {
            state.gameData = action.payload
            const currentState = JSON.parse(JSON.stringify(state))
            gameHistory = []
            gameHistory.push(currentState)
            historyCycle = 1
            for (let i = 0; i < 576; i++) {
                state.eventData.push({})
            }
        },
        setGameName(state, action: PayloadAction<string>) {
            state.gameName = action.payload
        },
        setGameLikes(state, action: PayloadAction<number>) {
            state.gameLikes = action.payload
        },
        modifyGame(state, action: PayloadAction<modifyGame>){
            const {index, property, modifier, record} = action.payload
            if (modifier !== "delete") {
                state.gameData[index][property] = modifier
            } else if (modifier === "delete"){
                console.log('delete collison!')
                state.gameData[index].type = "0"
                delete state.gameData[index].collision
            }
            if (record) {
                const currentState = JSON.parse(JSON.stringify(state))
                const historyLength = gameHistory.length
                const canvasHistoryTruncate = gameHistory.filter((item, index) => index <= historyLength - historyCycle) as []
                if (historyCycle > 1) {
                    gameHistory = canvasHistoryTruncate
                    historyCycle = 1
                }
                if (currentState !== null && Object.keys(currentState).length > 0) {
                    console.log('pushHistory')
                    gameHistory.push(currentState)
                }
            }
        },
        modifyEvent(state, action: PayloadAction<modifyGame>) {
            const {index, property, modifier} = action.payload
            state.eventData[index][property] = modifier
        },
        setGameSize(state, action: PayloadAction<gameSizeObj>){
            const {width, height} = action.payload
            state.gameSize = {width: width, height: height}
        },
        setGameLoaded(state) {
            state.gameLoaded = true
        },
        undo(state){
            try {
                const historyLength = gameHistory.length
                if (historyCycle < historyLength)  {
                    historyCycle += 1
                } else {
                    historyCycle = historyLength
                }
                console.log("historyLength: " + historyLength + " history cycle: " + historyCycle)
                const newState = gameHistory[historyLength - historyCycle]
                return newState
            } catch (e) {
                console.log(e)
            }
        },
        redo(state){
            try {
                const historyLength = gameHistory.length
                if (historyCycle > 1) { 
                    historyCycle -= 1
                } else {
                    historyCycle = 1
                }
                const newState = gameHistory[historyLength - historyCycle]
                return newState
            } catch (e) {
                console.log(e)
            }
        }
    }
})

export const {gameReset, loadGame, setGameName, setGameLikes, modifyGame, modifyEvent, setGameSize, setGameLoaded, undo, redo} = gameDataSlice.actions
export default gameDataSlice.reducer;