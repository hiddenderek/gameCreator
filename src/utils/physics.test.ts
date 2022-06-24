import {gravityManage, characterTrack} from './physics'
import { store } from '../app/store'
import { characterReset } from "../features/character/character-slice";
import { gameReset } from "../features/gameData/gameData-slice";

test('gravity test', ()=>{
    jest.useFakeTimers();
    store.dispatch(characterReset())
    store.dispatch(gameReset())
    gravityManage(true)
    const curStore = store.getState()
    console.log(curStore.character.y)
    expect(curStore.character.y).toBeLessThan(1)
    characterTrack({current:{getBoundingClientRect: ()=>{return {width: 1920, height: 1080}}}})
    setTimeout(()=>{
        const curStore = store.getState()
        expect(curStore.character.y).toBeGreaterThan(3)
    },1000)
    jest.advanceTimersByTime(1000)
})
