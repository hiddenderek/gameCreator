/**
 * @jest-environment jsdom
 */
 import React from 'react'
 import { screen, render, act } from '@testing-library/react'
 import { Provider } from 'react-redux'
 import { store } from '../app/store'
 import { BrowserRouter as Router } from 'react-router-dom'
 import Ranks from './Ranks'
 import { removeHealth } from '../features/character/character-slice'
 import {userData} from '../app/types'
 
 const dispatch = store.dispatch

 //total score == high scores achieved
 //score count == total likes recieved
 //play count == total plays recieved

 const testUserData : userData[] = [ 
    {username: "testUser1", total_score: 15, score_count: 0, play_count:968},
    {username: "testUser2", total_score: 0, score_count: 2, play_count:150},
    {username: "testUser3", total_score: 12, score_count: 1, play_count:557},
    {username: "testUser4", total_score: 27, score_count: 4, play_count:54},
    {username: "testUser5", total_score: 7, score_count: 769, play_count:7},
    {username: "testUser6", total_score: 48, score_count: 19, play_count:228},
    {username: "testUser7", total_score: 9, score_count: 75, play_count:0},
    {username: "testUser8", total_score: 6, score_count: 259, play_count:15},
    {username: "testUser9", total_score: 1, score_count: 150, play_count:27},
    {username: "testUser10", total_score: 83, score_count: 102, play_count:193}
]

 jest.mock('../utils/apicalls', () => {
    return {
        handleApiData: async (path: string, setState: Function, action: string, body: object) => {
            if (path.includes('/ranks/scores')) {
                const filteredResult = testUserData.slice().sort((a: userData, b: userData) => (a.total_score > b.total_score) ? -1 : 1)
                console.log('HIGH SCORE RESULT: ' + JSON.stringify(filteredResult))
                act(() => {
                    setState ? setState(filteredResult) : ""
                })
                return Promise.resolve({
                    data: { result: filteredResult },
                    status: 200
                })
            } else if (path.includes('/ranks/likes')) {
                const filteredResult = testUserData.slice().sort((a: userData, b: userData) => (a.score_count > b.score_count) ? -1 : 1)
                act(() => {
                    setState ? setState(filteredResult) : ""
                })
                return Promise.resolve({
                    data: { result: filteredResult },
                    status: 200
                })
            } else if (path.includes('/ranks/plays')) {
                const filteredResult = testUserData.slice().sort((a: userData, b: userData) => (a.play_count > b.play_count) ? -1 : 1)
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
                 <Ranks />
             </Provider>
         </Router>
     )
 })
 
 test('Rank high score populate', async () => {
     const rankHighScoreElm0 = screen.getByTestId('high_score_rank_0')
     const rankHighScoreElm9 = screen.getByTestId('high_score_rank_9')
     console.log(testUserData[9].username)
     expect(rankHighScoreElm0.textContent).toMatch(testUserData[9].username)
     expect(rankHighScoreElm9.textContent).toMatch(testUserData[1].username)
 })

 test('Rank likes populate', async () => {
    const rankLikesElm0 = screen.getByTestId('likes_rank_0')
    const rankLikesElm9 = screen.getByTestId('likes_rank_9')
    expect(rankLikesElm0.textContent).toMatch(testUserData[4].username)
    expect(rankLikesElm9.textContent).toMatch(testUserData[0].username)
})

test('Rank plays populate', async () => {
    const rankPlaysElm0 = screen.getByTestId('plays_rank_0')
    const rankPlaysElm9 = screen.getByTestId('plays_rank_9')
    expect(rankPlaysElm0.textContent).toMatch(testUserData[0].username)
    expect(rankPlaysElm9.textContent).toMatch(testUserData[6].username)
})