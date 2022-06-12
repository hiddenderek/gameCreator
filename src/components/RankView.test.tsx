/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, render, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import RankView from './RankView'
import { removeHealth } from '../features/character/character-slice'
import { rankItem } from '../app/types'


//total score == high scores achieved
//score count == total likes recieved
//play count == total plays recieved

const testRankData: rankItem[] = [
    { username: "testUser1", score: 15 },
    { username: "testUser2", score: 150 },
    { username: "testUser3", score: 27 },
]

jest.mock('../utils/apicalls', () => {
    return {
        handleApiData: async (path: string, setState: Function, action: string, body: object) => {
            if (path.includes('/scores')) {
                const filteredResult = testRankData.slice().sort((a: rankItem, b: rankItem) => (a.score > b.score) ? -1 : 1)
                act(() => {
                    setState ? setState(filteredResult) : ""
                })
                return Promise.resolve({
                    data: { result: filteredResult },
                    status: 200
                })
            }
        }
    }
})

beforeEach(async () => {
    render(
        <Router>
            <Provider store={store}>
                <RankView profileData={{ username: "testUser0" }} />
            </Provider>
        </Router>
    )
})

test('Rank Items populate', async () => {
    const RankIcons = screen.queryAllByTestId('rank_item')
    expect(RankIcons.length).toBe(3)
})

test('Rank Items placement', async () => {
    const RankIcons = screen.queryAllByTestId('rank_item')
    expect(RankIcons[0].textContent).toMatch(testRankData[1].score.toString())
})