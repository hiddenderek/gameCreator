import {createSlice, PayloadAction} from '@reduxjs/toolkit'; 


interface keyPressActions {
        currentUser: string,
        searchTerm: string,
        rankView: boolean
}

const initialState: keyPressActions = {
        currentUser: '',
        searchTerm: "",
        rankView: false,
    }

const userInterfaceSlice = createSlice({
    name: "userInterface",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<string>) {
            state.currentUser = action.payload
        },
        setSearchTerm(state, action: PayloadAction<string>) {
            state.searchTerm = action.payload
        },
        setRankView(state, action: PayloadAction<boolean>){
            state.rankView = action.payload
        }
    }
})

export const {setUser, setSearchTerm, setRankView} = userInterfaceSlice.actions
export default userInterfaceSlice.reducer;