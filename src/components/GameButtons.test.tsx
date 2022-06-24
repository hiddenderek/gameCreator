/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import GameButtons from './GameButtons'
import { renderWithRouter } from '../utils/testHelperFunctions'

beforeEach(async () => {
    await act(async () => {
        renderWithRouter(
            <Router>
                <Provider store={store}>
                    <GameButtons />
                </Provider>
            </Router>
            , { route: '/gameEditor/' })
    })
})

test('Game Button Minimizer', async () => {
    const user = userEvent.setup()
    const gameButtonMinizer = screen.getByTestId('game_button_minimizer')
    expect(gameButtonMinizer.textContent).toBe('Minimize Buttons')
    await user.click(gameButtonMinizer)
    expect(gameButtonMinizer.textContent).toBe('Maximize Buttons')
})

test('Game Button Jump', async () => {
    const user = userEvent.setup()
    const gameButtonJump = screen.getByTestId('game_button_jump')
    expect(gameButtonJump).not.toHaveClass('invert')
    await user.hover(gameButtonJump)
    expect(gameButtonJump).toHaveClass('invert')
})

test('Game Button Left', async () => {
    const user = userEvent.setup()
    const gameButtonLeft = screen.getByTestId('game_button_left')
    expect(gameButtonLeft).not.toHaveClass('invert')
    await user.hover(gameButtonLeft)
    expect(gameButtonLeft).toHaveClass('invert')
})

test('Game Button Right', async () => {
    const user = userEvent.setup()
    const gameButtonRight = screen.getByTestId('game_button_right')
    expect(gameButtonRight).not.toHaveClass('invert')
    await user.hover(gameButtonRight)
    expect(gameButtonRight).toHaveClass('invert')
})