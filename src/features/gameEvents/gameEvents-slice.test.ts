import { store } from '../../app/store'
import { eventReset, toggleSpikeStatus, countTime, evalTime, winGame } from './gameEvents-slice'
const dispatch = store.dispatch


beforeEach(()=>{
    dispatch(eventReset())
})

test('Toggle Edit Mode', () => {
    let gameEventState = store.getState().gameEvents
    expect(gameEventState.spikeStatus).toBe(false)
    dispatch(toggleSpikeStatus(true))
    gameEventState = store.getState().gameEvents
    expect(gameEventState.spikeStatus).toBe(true)
})

test('Set Current Element', () => {
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