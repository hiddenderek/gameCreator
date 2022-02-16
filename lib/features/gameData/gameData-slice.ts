import {createSlice, PayloadAction} from '@reduxjs/toolkit'; 

interface gameDataState {
    gameData: elementObj[],
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
interface gameSizeObj {
    width: number | undefined
    height: number | undefined
}
const initialState: gameDataState = {
    gameData: [],
    gameName: '',
    gameLikes: 0,
    gameSize: {width: 0, height: 0}
}
let historyCycle = 0
let gameHistory : gameDataState[] = []
const gameDataSlice = createSlice({
    name: "gameData",
    initialState,
    reducers: {
        gameReset: () => { 
            return initialState
        },
        loadGame(state, action: PayloadAction<elementObj[]>) {
            state.gameData = action.payload
        },
        setGameName(state, action: PayloadAction<string>) {
            state.gameName = action.payload
        },
        setGameLikes(state, action: PayloadAction<number>) {
            state.gameLikes = action.payload
        },
        modifyGame(state, action: PayloadAction<modifyGame>){
            const {index, property, modifier, record} = action.payload
            console.log(modifier)
            if (modifier !== "delete") {
                state.gameData[index][property] = modifier
            } else if (modifier === "delete"){
                console.log('delete collison!')
                state.gameData[index].type = "0"
                delete state.gameData[index][property]
            }
            if (record) {
                const currentState = JSON.parse(JSON.stringify(state))
                const historyLength = gameHistory.length
                const canvasHistoryTruncate = gameHistory.filter((item, index) => index <= historyLength - historyCycle) as []
                console.log(canvasHistoryTruncate)
                if (historyCycle > 0) {
                    gameHistory = canvasHistoryTruncate
                    historyCycle = 0
                }
                if (currentState !== null && Object.keys(currentState).length > 0) {
                    console.log('pushHistory')
                    gameHistory.push(currentState)
                }
                console.log(gameHistory)
            }
        },
        setGameSize(state, action: PayloadAction<gameSizeObj>){
            const {width, height} = action.payload
            state.gameSize = {width: width, height: height}
        },
        undo(state){
            try {
                const historyLength = gameHistory.length
                console.log(gameHistory)
                if (historyCycle < historyLength)  {
                    historyCycle += 1
                } else {
                    historyCycle = historyLength
                }
                console.log(historyCycle)
                const newState = gameHistory[historyLength - historyCycle]
                return newState
            } catch (e) {
                console.log(e)
            }
        },
        redo(state){
            try {
                const historyLength = gameHistory.length
                console.log(gameHistory)
                if (historyCycle > 1) { 
                    historyCycle -= 1
                } else {
                    historyCycle = 1
                }
                console.log(historyCycle)
                const newState = gameHistory[historyLength - historyCycle]
                return newState
            } catch (e) {
                console.log(e)
            }
        }
    }
})

export const {gameReset, loadGame, setGameName, setGameLikes, modifyGame, setGameSize, undo, redo} = gameDataSlice.actions
export default gameDataSlice.reducer;