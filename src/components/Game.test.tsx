/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router} from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Game from './Game'
import { gameReset } from '../features/gameData/gameData-slice'
import { gameEditorReset } from '../features/gameEditor/gameEditor-slice'
import { characterReset, removeHealth } from '../features/character/character-slice'
import { eventReset, winGame } from '../features/gameEvents/gameEvents-slice'
import fs from 'fs'
import { renderWithRouter } from '../utils/testHelperFunctions'

const dispatch = store.dispatch

jest.mock('../utils/apicalls', () => {
    return {
        handleApiData: async (path: string, setState: Function, action: string, body: object) => {
            console.log('SET STATE: ' + setState)
            console.log('PATH: ' + path + " ACTION: " + action)
            if (path === null && action === "get") {
                const testGameData = fs.readFileSync("./src/data/gameData.txt", {encoding: "utf-8"})
                console.log('TEST GAME DATA: ' + testGameData.length)
                act(() => {
                    setState ? setState(testGameData) : ""
                })
                return Promise.resolve({
                    data: testGameData,
                    status: 200
                })
            }
        }
    }
})

jest.useFakeTimers()

beforeEach(()=>{
    dispatch(gameReset())
    dispatch(gameEditorReset())
    dispatch(characterReset())
    dispatch(eventReset())
    renderWithRouter(
        <Router>
            <Provider store = {store}>
                <Game profileData={{username: "Test User"}} aspectRatio = {1.5} isMobile = {false}/>
            </Provider>
        </Router>
    , {route: '/games/test_game'})
})

test('Game Element Populate', () => {
    const gameElementList = screen.queryAllByTestId('game_element')
    expect(gameElementList.length).toBe(576)
})

test('Game Lose', () => {
    dispatch(removeHealth(10))
    const gameOverCheck = screen.getByText('Game Over')
    expect(gameOverCheck).toBeInTheDocument()

})

test('Game Win', () => {
    dispatch(winGame())
    const gameOverCheck = screen.getByText('You Win!')
    expect(gameOverCheck).toBeInTheDocument()
})
