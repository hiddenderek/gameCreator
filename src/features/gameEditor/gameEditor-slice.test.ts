import { store } from '../../app/store'
import {toggleEditMode, setCurrentElement, gameEditorReset} from './gameEditor-slice'
const dispatch = store.dispatch


beforeEach(()=>{
    dispatch(gameEditorReset())
})

test('Toggle Edit Mode', () => {
    let gameEditorState = store.getState().gameEditor
    expect(gameEditorState.editMode).toBe(false)
    dispatch(toggleEditMode(true))
    gameEditorState = store.getState().gameEditor
    expect(gameEditorState.editMode).toBe(true)
})

test('Set Current Element', () => {
    let gameEditorState = store.getState().gameEditor
    expect(gameEditorState.currentElement).toBe("0")
    dispatch(setCurrentElement("1"))
    gameEditorState = store.getState().gameEditor
    expect(gameEditorState.currentElement).toBe("1")
})

