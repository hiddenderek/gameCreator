/**
 * @jest-environment jsdom
 */
 import React from 'react'
 import { screen, render, act } from '@testing-library/react'
 import { Provider } from 'react-redux'
 import { store } from '../app/store'
 import { BrowserRouter as Router } from 'react-router-dom'
 import Home from './Home'
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
            if (path.includes('/trending')) {
                act(() => {
                    setState ? setState(testUserData) : ""
                })
                return Promise.resolve({
                    data: { result: testUserData },
                    status: 200
                })
            }  
        }
    }
})

jest.mock('./GameIcon', () => {
    return () => <div data-testid = "game_icon"/>
})
 
 beforeEach(async () => {
     render(
         <Router>
             <Provider store={store}>
                 <Home profileData={{username: "testUser0"}}/>
             </Provider>
         </Router>
     )
 })
 
 test('Trending games populate', async () => {
     const gameIcons = screen.queryAllByTestId('game_icon')
     expect(gameIcons.length).toBe(10)
 })
