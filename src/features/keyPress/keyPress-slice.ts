import {createSlice, PayloadAction} from '@reduxjs/toolkit'; 

interface keyPressActions {
        space: boolean,
        left: boolean,
        right: boolean,
        z: boolean,
        y: boolean,
        ctrl: boolean
}

const initialState: keyPressActions = {
        space: false,
        left: false,
        right: false,
        z: false,
        y: false,
        ctrl: false

}

const keyPressSlice = createSlice({
    name: "keyPress",
    initialState,
    reducers: {
        resetKeys(state) {
            return initialState
        },
        toggleSpace(state, action: PayloadAction<boolean>) {
            console.log('space' + action.payload)
            state.space = action.payload
        },
        toggleLeft(state, action: PayloadAction<boolean>) {
            console.log('space' + action.payload)
            state.left = action.payload
        },
        toggleRight(state, action: PayloadAction<boolean>) {
            console.log('space' + action.payload)
            state.right = action.payload
        },
        toggleZ(state, action: PayloadAction<boolean>) {
            console.log('z' + action.payload)
            state.z = action.payload
        },   
        toggleY(state, action: PayloadAction<boolean>) {
            state.y = action.payload
        },
        toggleCtrl(state, action: PayloadAction<boolean>) {
            state.ctrl = action.payload
        } 
    }
})

export const {resetKeys, toggleSpace, toggleLeft, toggleRight, toggleZ, toggleY, toggleCtrl} = keyPressSlice.actions
export default keyPressSlice.reducer;