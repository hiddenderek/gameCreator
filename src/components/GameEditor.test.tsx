/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import GameEditor from './GameEditor'
import { gameReset, setGameName } from '../features/gameData/gameData-slice'
import { gameEditorReset } from '../features/gameEditor/gameEditor-slice'
import { renderWithRouter } from '../utils/testHelperFunctions'

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

jest.mock('html2canvas', () => {
    return async function html2canvas () {
        return Promise.resolve({
            toDataURL: () => {
                return 'Test Image'
            }
        })
    }

})

beforeEach(() => {
    dispatch(gameReset())
    dispatch(gameEditorReset())
    dispatch(setGameName('test'))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <GameEditor turnOnSideBar = {()=>{}} profileData = {{username: "testUser"}}/>
            </Provider>
        </Router>
    , {route: "/gameEditor/testUser/test"})
})

test('Game Element Click', async () => {
    const user = userEvent.setup()
    const emptyButtonElm = screen.getByTestId('empty_element_btn')
    await user.click(emptyButtonElm)
    expect(emptyButtonElm).toHaveClass('elementSelected')
    const groundButtonElm = screen.getByTestId('ground_element_btn')
    await user.click(groundButtonElm)
    expect(emptyButtonElm).not.toHaveClass('elementSelected')
    expect(groundButtonElm).toHaveClass('elementSelected')
    const lavaButtonElm = screen.getByTestId('lava_element_btn')
    await user.click(lavaButtonElm)
    expect(groundButtonElm).not.toHaveClass('elementSelected')
    expect(lavaButtonElm).toHaveClass('elementSelected')
    const spikeButtonElm = screen.getByTestId('spike_element_btn')
    await user.click(spikeButtonElm)
    expect(lavaButtonElm).not.toHaveClass('elementSelected')
    expect(spikeButtonElm).toHaveClass('elementSelected')
    const goalButtonElm = screen.getByTestId('goal_element_btn')
    await user.click(goalButtonElm)
    expect(spikeButtonElm).not.toHaveClass('elementSelected')
    expect(goalButtonElm).toHaveClass('elementSelected')
    const platformButtonElm = screen.getByTestId('platform_element_btn')
    await user.click(platformButtonElm)
    expect(goalButtonElm).not.toHaveClass('elementSelected')
    expect(platformButtonElm).toHaveClass('elementSelected')
})

test('Game Title Change', async () => {
    const user = userEvent.setup()
    const titleInputElm = screen.getByTestId('game_title_input') as HTMLInputElement
    await user.clear(titleInputElm)
    await user.type(titleInputElm, "Test Game Title")
    expect(titleInputElm.value).toBe('Test Game Title')
})

test('Game Save Response', async () => {
    const user = userEvent.setup()
    let errorMessageText = screen.queryByText('FAILED TO SAVE GAME')
    expect(errorMessageText).toBe(null)
    const gameSaveButton = screen.getByTestId('game_save_btn')
    await user.click(gameSaveButton)
    errorMessageText = screen.getByText('FAILED TO SAVE GAME')
    expect(errorMessageText).toBeInTheDocument()
}) 
