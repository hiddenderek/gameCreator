import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import gameDataReducer from '../features/gameData/gameData-slice'
import characterReducer from '../features/character/character-slice'
import keyPressReducer from '../features/keyPress/keyPress-slice'
import gameEditorReducer from '../features/gameEditor/gameEditor-slice'
import gameEventsReducer from '../features/gameEvents/gameEvents-slice'
import userInterfaceReducer from '../features/userInterface/userInterface-slice'
export const store = configureStore({
    reducer: {
        gameData: gameDataReducer,
        character: characterReducer,
        keyPress: keyPressReducer,
        gameEditor: gameEditorReducer,
        gameEvents: gameEventsReducer,
        userInterface: userInterfaceReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>