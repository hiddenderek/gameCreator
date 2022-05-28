import { handleKeyPress } from "./handleKeyPress";
import { refreshRate, moveRate, jumpAmountRate, jumpDecreaseRate, jumpArcPeak} from './physicsConfig'
import { characterReset, toggleGravity } from "../features/character/character-slice";
import { gameReset } from "../features/gameData/gameData-slice";
import { store } from '../app/store'


test('right key test', ()=>{
    store.dispatch(characterReset())
    store.dispatch(gameReset())
    jest.useFakeTimers();
    handleKeyPress({key: "ArrowRight", ctrlKey: false, target: {tagName: "DIV"}} as any)
    const curStore = store.getState()
    console.log(curStore.keyPress.right)
    expect(curStore.keyPress.right).toBe(true)

    setTimeout(()=>{
        const curStore = store.getState()
        const characterMoveAmount = (3000 / refreshRate) * moveRate 
        console.log(curStore.character.x)
        console.log(characterMoveAmount)
        expect(curStore.character.x).toBeGreaterThanOrEqual(characterMoveAmount)
    },3000)

    jest.advanceTimersByTime(3000);
})

test('left key test', ()=>{
    store.dispatch(characterReset())
    store.dispatch(gameReset())
    jest.useFakeTimers();
    handleKeyPress({key: "ArrowLeft", ctrlKey: false, target: {tagName: "DIV"}} as any)
    const curStore = store.getState()
    console.log(curStore.keyPress.left)
    expect(curStore.keyPress.left).toBe(true)

    setTimeout(()=>{
        const curStore = store.getState()
        const characterMoveAmount = ((3000 / refreshRate) * moveRate) * -1
        console.log(curStore.character.x)
        console.log(characterMoveAmount)
        expect(curStore.character.x).toBeLessThanOrEqual(moveRate)
    },3000)

    jest.advanceTimersByTime(3000);
})

test('jump test', ()=>{
    store.dispatch(characterReset())
    store.dispatch(gameReset())
    store.dispatch(toggleGravity(false))
    jest.useFakeTimers();
    handleKeyPress({key: " ", ctrlKey: false, target: {tagName: "DIV"}} as any)
    const curStore = store.getState()
    console.log(curStore.keyPress.space)
    expect(curStore.keyPress.space).toBe(true)

    setTimeout(()=>{
        const curStore = store.getState()
        expect(curStore.character.y).toBeLessThan(-1)
    },1000)

    jest.advanceTimersByTime(1000);
})