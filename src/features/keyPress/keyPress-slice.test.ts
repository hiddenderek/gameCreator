import { store } from '../../app/store'
import {resetKeys, toggleSpace, toggleLeft, toggleRight, toggleZ, toggleY, toggleCtrl} from './keyPress-slice'
const dispatch = store.dispatch


beforeEach(()=>{
    dispatch(resetKeys())
})

test('Toggle Space', () => {
    let keyPressState = store.getState().keyPress
    expect(keyPressState.space).toBe(false)
    dispatch(toggleSpace(true))
    keyPressState = store.getState().keyPress
    expect(keyPressState.space).toBe(true)
})

test('T', () => {
    let gameEventState = store.getState().gameEvents
    expect(gameEventState.timer).toBe(0)
    dispatch(countTime())
    gameEventState = store.getState().gameEvents
    expect(gameEventState.timer).toBe(1)
    dispatch(countTime())
    gameEventState = store.getState().gameEvents
    expect(gameEventState.timer).toBe(2)
    dispatch(countTime())
    gameEventState = store.getState().gameEvents
    expect(gameEventState.timer).toBe(3)
})

test('Eval Time Seconds', () => {
    let gameEventState = store.getState().gameEvents
    expect(gameEventState.playTimeHours).toBe(0)
    expect(gameEventState.playTimeMinutes).toBe(0)
    expect(gameEventState.playTimeSeconds).toBe(0)
    for (let i = 0; i < 55; i++) {
        dispatch(countTime())
    }
    dispatch(evalTime())
    gameEventState = store.getState().gameEvents
    expect(gameEventState.playTimeHours).toBe(0)
    expect(gameEventState.playTimeMinutes).toBe(0)
    expect(gameEventState.playTimeSeconds).toBe(55)
})

test('Eval Time Minute +', () => {
    let gameEventState = store.getState().gameEvents
    expect(gameEventState.playTimeHours).toBe(0)
    expect(gameEventState.playTimeMinutes).toBe(0)
    expect(gameEventState.playTimeSeconds).toBe(0)
    for (let i = 0; i < 650; i++) {
        dispatch(countTime())
    }
    dispatch(evalTime())
    gameEventState = store.getState().gameEvents
    expect(gameEventState.playTimeHours).toBe(0)
    expect(gameEventState.playTimeMinutes).toBe(10)
    expect(gameEventState.playTimeSeconds).toBe(50)
})

test('Eval Time Hour + ', () => {
    let gameEventState = store.getState().gameEvents
    expect(gameEventState.playTimeHours).toBe(0)
    expect(gameEventState.playTimeMinutes).toBe(0)
    expect(gameEventState.playTimeSeconds).toBe(0)
    for (let i = 0; i < 4000; i++) {
        dispatch(countTime())
    }
    dispatch(evalTime())
    gameEventState = store.getState().gameEvents
    expect(gameEventState.playTimeHours).toBe(1)
    expect(gameEventState.playTimeMinutes).toBe(6)
    expect(gameEventState.playTimeSeconds).toBe(40)
})

test('Win game + ', () => {
    let gameEventState = store.getState().gameEvents
    expect(gameEventState.winGame).toBe(false)
    dispatch(winGame())
    gameEventState = store.getState().gameEvents
    expect(gameEventState.winGame).toBe(true)
})