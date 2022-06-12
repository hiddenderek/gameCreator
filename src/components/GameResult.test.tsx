/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, act, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import GameResult from './GameResult'
import { characterReset, removeHealth } from '../features/character/character-slice'
import { eventReset, winGame } from '../features/gameEvents/gameEvents-slice'

const dispatch = store.dispatch

beforeEach(async () => {
    dispatch(characterReset())
    dispatch(eventReset())
    await act(async () => {
        render(
            <Router>
                <Provider store={store}>
                    <GameResult />
                </Provider>
            </Router>
        )
    })
})



test('Game Over', async () => {
    let gameOverElm = screen.queryByText('Game Over')
    expect(gameOverElm).not.toBeInTheDocument()
    dispatch(removeHealth(10))
    gameOverElm = screen.getByText('Game Over')
    expect(gameOverElm).toBeInTheDocument()
})

test('Game Win', () => {
    let winElm = screen.queryByText('You Win!')
    expect(winElm).not.toBeInTheDocument()
    dispatch(winGame())
    winElm = screen.getByText('You Win!')
    expect(winElm).toBeInTheDocument()
})