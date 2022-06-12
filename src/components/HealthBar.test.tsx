/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import HealthBar from './HealthBar'
import { removeHealth } from '../features/character/character-slice'

const dispatch = store.dispatch

beforeEach(async () => {
    render(
        <Router>
            <Provider store={store}>
                <HealthBar />
            </Provider>
        </Router>
    )
})

test('Game Button Minimizer', async () => {
    let healthBarBockElms = screen.queryAllByTestId('health_bar_block')
    expect(healthBarBockElms.length).toBe(10)
    dispatch(removeHealth(5))
    healthBarBockElms = screen.queryAllByTestId('health_bar_block')
    expect(healthBarBockElms.length).toBe(5)
})