import { handleKeyPress } from "./handleKeyPress";
import { refreshRate, moveRate, jumpAmountRate, jumpDecreaseRate, jumpArcPeak} from './physicsConfig'
import { store } from '../app/store'


test('right key test', ()=>{
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
        expect(curStore.character.x).toBeLessThanOrEqual(characterMoveAmount)
    },3000)

    jest.advanceTimersByTime(3000);
})