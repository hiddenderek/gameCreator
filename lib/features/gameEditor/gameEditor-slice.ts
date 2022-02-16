import {createSlice, PayloadAction} from '@reduxjs/toolkit'; 

interface gameDataState {
    editMode: boolean
    currentElement: string
}
const initialState: gameDataState = {
    editMode: false,
    currentElement: "0"
}

const gameEditorSlice = createSlice({
    name: "gameEditor",
    initialState,
    reducers: {
        toggleEditMode(state, action: PayloadAction<boolean>) {
            state.editMode = action.payload
        },
        setCurrentElement(state, action: PayloadAction<string>){
            state.currentElement = action.payload
            console.log(state.currentElement)
        },
        gameEditorReset() {
            return initialState
        }
    }
})

export const {toggleEditMode, setCurrentElement, gameEditorReset} = gameEditorSlice.actions
export default gameEditorSlice.reducer;