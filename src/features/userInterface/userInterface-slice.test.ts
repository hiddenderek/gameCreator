import { store } from '../../app/store'
import {userInterfaceReset, setUser, setSearchTerm, setRankView} from './userInterface-slice'
const dispatch = store.dispatch


beforeEach(()=>{
    dispatch(userInterfaceReset())
})

test('Set User', () => {
    let userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.currentUser).toBe('')
    dispatch(setUser('Test User'))
    userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.currentUser).toBe('Test User')
})

test('Set Search Term', () => {
    let userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.searchTerm).toBe('')
    dispatch(setSearchTerm('Searching Test'))
    userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.searchTerm).toBe('Searching Test')
})


test('Set Rank View', () => {
    let userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.rankView).toBe(false)
    dispatch(setRankView(true))
    userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.rankView).toBe(true)
})
