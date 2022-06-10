/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router} from 'react-router-dom'
import Character from './Character'
import { clearCharacterTrack } from '../utils/physics'
import { changeX, jump, removeHealth } from '../features/character/character-slice'

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
    const characterElm = screen.getByTestId('game_character')
    expect(characterElm.style.transform).toMatch('scaleX(1)')
    dispatch(changeX(-1))
    expect(characterElm.style.transform).toMatch('scaleX(-1)')
})

test('Move Right', () => {
    const characterElm = screen.getByTestId('game_character')
    expect(characterElm.style.transform).toMatch('scaleX(1)')
    dispatch(changeX(1))
    expect(characterElm.style.transform).toMatch('scaleX(1)')
})

test('Jump', () => {    
    const characterElm = screen.getByTestId('game_character')
    expect(characterElm).not.toHaveClass('characterJump')
    dispatch(jump(true))
    expect(characterElm).toHaveClass('characterJump')
})

test('Remove health', () => {
    const characterElm = screen.getByTestId('game_character')
    expect(characterElm).not.toHaveClass('characterLightDamage')
    expect(characterElm).not.toHaveClass('characterMediumDamage')
    expect(characterElm).not.toHaveClass('characterHighDamage')
    dispatch(removeHealth(4))
    expect(characterElm).toHaveClass('characterLightDamage')
    dispatch(removeHealth(3))
    expect(characterElm).toHaveClass('characterMediumDamage')
    dispatch(removeHealth(2))
    expect(characterElm).toHaveClass('characterHighDamage')
})