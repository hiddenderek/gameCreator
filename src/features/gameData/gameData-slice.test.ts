import { store } from '../../app/store'
import fs from 'fs'
import {gameReset, loadGame, setGameName, setGameLikes, modifyGame, modifyEvent, setGameSize, setGameLoaded, undo, redo, gameHistory} from './gameData-slice'
const dispatch = store.dispatch


beforeEach(()=>{
    dispatch(gameReset())
})

test('Load Game', () => {
    let gameDataState = store.getState().gameData
    expect(gameDataState.gameData.length).toBe(0)
    const gameDataGet = JSON.parse(fs.readFileSync("./src/data/gameData.txt", {encoding: "utf-8"}))
    const gameData = gameDataGet.game_data['1-1'].gameData
    dispatch(loadGame(gameData))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData.length).toBe(576)
    expect(gameDataState.eventData.length).toBe(576)
})

test('Set Game Name', () => {
    let gameDataState = store.getState().gameData
    expect(gameDataState.gameName).toBe('')
    dispatch(setGameName('Test Game'))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameName).toBe('Test Game')
})

test('Set Game Likes', () => {
    let gameDataState = store.getState().gameData
    expect(gameDataState.gameLikes).toBe(0)
    dispatch(setGameLikes(1))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameLikes).toBe(1)
})

test('Modify Game Element', () => {
    let gameDataState = store.getState().gameData
    expect(gameDataState.gameData.length).toBe(0)
    const gameDataGet = JSON.parse(fs.readFileSync("./src/data/gameData.txt", {encoding: "utf-8"}))
    const gameData = gameDataGet.game_data['1-1'].gameData
    dispatch(loadGame(gameData))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("0")
    expect(gameHistory.length).toBe(1)
    dispatch(modifyGame({index: 0, property: "type", modifier: "1", record: true}))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("1")
    expect(gameHistory.length).toBe(2)
    dispatch(modifyGame({index: 0, property: "collision", modifier: "delete", record: true}))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("0")
    expect(gameHistory.length).toBe(3)
})

test('Modify Event', () => {
    let gameDataState = store.getState().gameData
    expect(gameDataState.gameData.length).toBe(0)
    const gameDataGet = JSON.parse(fs.readFileSync("./src/data/gameData.txt", {encoding: "utf-8"}))
    const gameData = gameDataGet.game_data['1-1'].gameData
    dispatch(loadGame(gameData))
    gameDataState = store.getState().gameData
    expect(gameDataState.eventData[0].collisionActive).toBe(undefined)
    dispatch(modifyEvent({index: 0, property: "collisionActive", modifier: true, record: false}))
    gameDataState = store.getState().gameData
    expect(gameDataState.eventData[0].collisionActive).toBe(true)
})

test('Set Game Size', () => {
    let gameDataState = store.getState().gameData
    expect(gameDataState.gameSize).toEqual({width: 0, height: 0})
    dispatch(setGameSize({width: 800, height: 400}))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameSize).toEqual({width: 800, height: 400})
})

test('Set Game Loaded', () => {
    let gameDataState = store.getState().gameData
    expect(gameDataState.gameLoaded).toBe(false)
    dispatch(setGameLoaded())
    gameDataState = store.getState().gameData
    expect(gameDataState.gameLoaded).toBe(true)
})

test('Undo', () => {
    let gameDataState = store.getState().gameData
    expect(gameDataState.gameData.length).toBe(0)
    const gameDataGet = JSON.parse(fs.readFileSync("./src/data/gameData.txt", {encoding: "utf-8"}))
    const gameData = gameDataGet.game_data['1-1'].gameData
    dispatch(loadGame(gameData))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("0")
    expect(gameHistory.length).toBe(1)
    dispatch(modifyGame({index: 0, property: "type", modifier: "1", record: true}))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("1")
    expect(gameHistory.length).toBe(2)
    dispatch(modifyGame({index: 0, property: "type", modifier: "2", record: true}))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("2")
    expect(gameHistory.length).toBe(3)
    dispatch(undo())
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("1")
    expect(gameHistory.length).toBe(3)
    dispatch(undo())
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("0")
    expect(gameHistory.length).toBe(3)
    dispatch(undo())
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("0")
    expect(gameHistory.length).toBe(3)
})

test('Redo', () => {
    let gameDataState = store.getState().gameData
    expect(gameDataState.gameData.length).toBe(0)
    const gameDataGet = JSON.parse(fs.readFileSync("./src/data/gameData.txt", {encoding: "utf-8"}))
    const gameData = gameDataGet.game_data['1-1'].gameData
    dispatch(loadGame(gameData))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("0")
    expect(gameHistory.length).toBe(1)
    dispatch(modifyGame({index: 0, property: "type", modifier: "1", record: true}))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("1")
    expect(gameHistory.length).toBe(2)
    dispatch(modifyGame({index: 0, property: "type", modifier: "2", record: true}))
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("2")
    expect(gameHistory.length).toBe(3)
    dispatch(undo())
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("1")
    expect(gameHistory.length).toBe(3)
    dispatch(undo())
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("0")
    expect(gameHistory.length).toBe(3)
    dispatch(redo())
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("1")
    expect(gameHistory.length).toBe(3)
    dispatch(redo())
    gameDataState = store.getState().gameData
    expect(gameDataState.gameData[0].type).toBe("2")
    expect(gameHistory.length).toBe(3)
})