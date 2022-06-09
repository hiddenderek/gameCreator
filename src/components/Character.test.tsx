/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router} from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Character from './Character'
import { clearCharacterTrack } from '../utils/physics'

const dispatch = store.dispatch

jest.spyOn(global, 'clearTimeout')

beforeEach(()=>{
    render(
        <Router>
            <Provider store = {store}>
                <Character/>
            </Provider>
        </Router>
    )
})

afterEach(()=>{
    jest.useFakeTimers()
    clearCharacterTrack()
})

test('Move Left', () => {
    
})

test('Move Right', () => {

})

test('Jump', () => {

})

test('Remove health', () => {

})