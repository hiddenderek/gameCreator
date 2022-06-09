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

test('Toggle Left', () => {
    let keyPressState = store.getState().keyPress
    expect(keyPressState.left).toBe(false)
    dispatch(toggleLeft(true))
    keyPressState = store.getState().keyPress
    expect(keyPressState.left).toBe(true)
})

test('Toggle Right', () => {
    let keyPressState = store.getState().keyPress
    expect(keyPressState.right).toBe(false)
    dispatch(toggleRight(true))
    keyPressState = store.getState().keyPress
    expect(keyPressState.right).toBe(true)
})

test('Toggle Z', () => {
    let keyPressState = store.getState().keyPress
    expect(keyPressState.z).toBe(false)
    dispatch(toggleZ(true))
    keyPressState = store.getState().keyPress
    expect(keyPressState.z).toBe(true)
})

test('Toggle Y', () => {
    let keyPressState = store.getState().keyPress
    expect(keyPressState.y).toBe(false)
    dispatch(toggleY(true))
    keyPressState = store.getState().keyPress
    expect(keyPressState.y).toBe(true)
})

test('Toggle Ctrl', () => {
    let keyPressState = store.getState().keyPress
    expect(keyPressState.ctrl).toBe(false)
    dispatch(toggleCtrl(true))
    keyPressState = store.getState().keyPress
    expect(keyPressState.ctrl).toBe(true)
})