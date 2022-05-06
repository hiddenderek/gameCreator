import {createSlice, PayloadAction} from '@reduxjs/toolkit'; 

interface characterProps {
        gravity: boolean,
        health: number,
        ammo: number,
        x: number,
        y: number,
        jump: boolean,
        direction: string,
        characterLoop: NodeJS.Timeout | {}
        moveAmount: number
}

const initialState: characterProps = {
        gravity: true,
        health: 10,
        ammo: 20,
        x: 0,
        y: 0,
        jump: false,
        direction: "right",
        characterLoop: {},
        moveAmount: .8,

}

const characterSlice = createSlice({
    name: "character",
    initialState,
    reducers: {
        characterReset: () => { 
            return initialState
        },
        toggleGravity(state, action: PayloadAction<boolean>) {
            state.gravity = action.payload
        },
        changeX(state, action: PayloadAction<number>) {
            state.x = state.x + action.payload
            if (action.payload < 0) {
                state.direction = "left"
            } else if (action.payload >= 0) {
                state.direction = "right"
            }
        },
        changeY(state, action: PayloadAction<number>) {
            state.y = state.y + action.payload
        },
        setY(state, action: PayloadAction<number>) {
            state.y = action.payload
        },
        setX(state, action: PayloadAction<number>) {
            state.x = action.payload
        },
        jump(state, action: PayloadAction<boolean>) {
            state.jump = action.payload
        },
        removeHealth(state, action: PayloadAction<number>) {
            if (state.health > 0 ){
                state.health = state.health - action.payload
            }
        },
        changeMoveAmount(state, action: PayloadAction<number>) {
            state.moveAmount = action.payload
        },
        clearCharacterLoop(state) {

        }
    }
})

export const {characterReset, toggleGravity, changeX, changeY, setY, setX, jump, removeHealth, changeMoveAmount, clearCharacterLoop} = characterSlice.actions
export default characterSlice.reducer;