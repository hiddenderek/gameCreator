/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import GameElement from './GameElement'
import { gameReset, loadGame } from '../features/gameData/gameData-slice'
import { gameEditorReset, setCurrentElement } from '../features/gameEditor/gameEditor-slice'
import { renderWithRouter } from '../utils/testHelperFunctions'
import fs from 'fs'

const dispatch = store.dispatch

jest.mock('../utils/apicalls', () => {
    return {
        handleApiData: async (path: string, setState: Function, action: string, body: object) => {
            console.log('SET STATE: ' + setState)
            console.log('PATH: ' + path + " ACTION: " + action)
            if (path.includes('/games/')) {
                act(() => {
                    setState ? setState() : ""
                })
                return Promise.resolve({
                    data: "Failed to save game",
                    status: 500
                })
            }
        }
    }
})

beforeEach(() => {
    dispatch(gameReset())
    dispatch(gameEditorReset())
    const testGameData = JSON.parse(fs.readFileSync("./src/data/gameData.txt", { encoding: "utf-8" }))
    dispatch(loadGame(testGameData?.game_data["1-1"]?.gameData))
    dispatch(setCurrentElement("1"))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <GameElement index={0} ref={{ current: { getBoundingClientRect: () => { return { width: 1920, height: 1080 } } } }} />
            </Provider>
        </Router>
        , { route: "/gameEditor/testUser/test" })
})



test('Game Element Change', async () => {
    const user = userEvent.setup()
    const gameElementElm = screen.getByTestId('game_element')
    expect(gameElementElm).toHaveClass('emptyElement')
    await user.click(gameElementElm)
    expect(gameElementElm).toHaveClass('groundElement')
})
