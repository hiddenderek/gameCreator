import { store } from '../../app/store'
import {moveRate} from '../../utils/physicsConfig'
import {characterReset, toggleGravity, changeX, changeY, setY, setX, jump, removeHealth, changeMoveAmount, clearCharacterLoop} from './character-slice'
const dispatch = store.dispatch


beforeEach(()=>{
    dispatch(characterReset())
})

test('Toggle Gravity', () => {
    let characterState = store.getState().character
    expect(characterState.gravity).toBe(true)
    dispatch(toggleGravity(false))
    characterState = store.getState().character
    expect(characterState.gravity).toBe(false)
})

test('Change X left', () => {
    let characterState = store.getState().character
    expect(characterState.x).toBe(0)
    dispatch(changeX(-1))
    characterState = store.getState().character
    expect(characterState.x).toBe(-1)
    expect(characterState.direction).toBe('left')
})

test('Change X right', () => {
    let characterState = store.getState().character
    expect(characterState.x).toBe(0)
    dispatch(changeX(1))
    characterState = store.getState().character
    expect(characterState.x).toBe(1)
    expect(characterState.direction).toBe('right')
})

test('Change Y', () => {
    let characterState = store.getState().character
    expect(characterState.y).toBe(0)
    dispatch(changeY(1))
    characterState = store.getState().character
    expect(characterState.y).toBe(1)
})

test('Set Y', () => {
    let characterState = store.getState().character
    expect(characterState.y).toBe(0)
    dispatch(setY(1))
    characterState = store.getState().character
    expect(characterState.y).toBe(1)
})

test('Set X', () => {
    let characterState = store.getState().character
    expect(characterState.x).toBe(0)
    dispatch(setX(1))
    characterState = store.getState().character
    expect(characterState.x).toBe(1)
})

test('Jump', () => {
    let characterState = store.getState().character
    expect(characterState.jump).toBe(false)
    dispatch(jump(true))
    characterState = store.getState().character
    expect(characterState.jump).toBe(true)
})

test('Remove Health', () => {
    let characterState = store.getState().character
    expect(characterState.health).toBe(10)
    dispatch(removeHealth(10))
    characterState = store.getState().character
    expect(characterState.health).toBe(0)
    dispatch(removeHealth(1))
    characterState = store.getState().character
    expect(characterState.health).toBe(0)
})

test('Change Move Amount', () => {
    let characterState = store.getState().character
    expect(characterState.moveAmount).toBe(moveRate)
    dispatch(changeMoveAmount(10))
    characterState = store.getState().character
    expect(characterState.moveAmount).toBe(10)
})

test('Clear Character Loop', () => {
    let characterState = store.getState().character
})