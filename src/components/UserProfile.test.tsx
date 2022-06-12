/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, render, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import UserProfile from './UserProfile'
import Banner from './Banner'
import { getAfterLastCharacter } from '../utils/stringParse'
import { userData } from '../app/types'
import { renderWithRouter } from '../utils/testHelperFunctions'
import userEvent from '@testing-library/user-event'

const dispatch = store.dispatch

//total score == high scores achieved
//score count == total likes recieved
//play count == total plays recieved

type fakeGameData = {
    game_name: string,
    plays: number,
    likes: number,
    dislikes: number,
    grid_image: string,
    userId: string,
    username: string,
    [key: string]: any
}

const testGameData: fakeGameData[] = [
    { game_name: "Test Game 1", time_created: "12/27/1994", plays: 120, likes: 40, dislikes: 15, grid_image: "", userId: "asdf1234", username: "testUser1" },
    { game_name: "Test Game 2", time_created: "9/17/1996", plays: 100, likes: 35, dislikes: 5, grid_image: "", userId: "ghjk5678", username: "testUser2" },
    { game_name: "Test Game 3", time_created: "5/15/1995", plays: 186, likes: 95, dislikes: 25, grid_image: "", userId: "lzxc9012", username: "testUser3" },
    { game_name: "Best Game", time_created: "8/7/1997", plays: 500, likes: 105, dislikes: 1, grid_image: "", userId: "vbnm3456", username: "testUser4" },
    { game_name: "Worst Game", time_created: "11/22/1998", plays: 90, likes: 1, dislikes: 85, grid_image: "", userId: "qwer7890", username: "testUser4" },
    { game_name: "Mediocre Game", time_created: "10/1/1999", plays: 85, likes: 25, dislikes: 25, grid_image: "", userId: "tyui1234", username: "testUser4" },
    { game_name: "Ignored game", time_created: "7/4/2010", plays: 2, likes: 0, dislikes: 0, grid_image: "", userId: "opas5678", username: "testUser5" }
]

jest.mock('../utils/apicalls', () => {
    return {
        handleApiData: async (path: string, setState: Function, action: string, body: object) => {
            if (path.includes('/games/') && action === "get") {
                const searchString = getAfterLastCharacter({ string: path, character: '?' })
                const { search } = JSON.parse('{"' + decodeURI(searchString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
                let testGameSort = testGameData
                if (search) {
                    const testGameSearch = testGameData.filter((item) => item.game_name.includes(search))
                    testGameSort = testGameSearch.slice().sort((a: fakeGameData, b: fakeGameData) => {
                        const firstVal = Date.parse(a.time_created)
                        const secondVal = Date.parse(b.time_created)
                        return (firstVal > secondVal ? -1 : 1)
                    })
                } 
                act(() => {
                    setState ? setState(testGameSort) : ""
                })
                return Promise.resolve({
                    data: testGameSort,
                    status: 200
                })
            }
        }
    }
})

jest.mock('./GameIcon', () => {
    return () => <div data-testid="game_icon" />
})

beforeEach(async () => {
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <Banner setProfileData={""} profileData={{ username: "testUser0" }} aspectRatio={1.5} isMobile={false} />
                <UserProfile profileData={{ username: "testUser0" }} />
            </Provider>
        </Router>
        , { route: '/users/testUser0' })
})

test('Profile Games Populate', () => {
    const gameIcons = screen.queryAllByTestId('game_icon')
    expect(gameIcons.length).toBe(7)
})

test('Profile Games Search', async () => {
    const user = userEvent.setup()
    const bannerSearchBarElm = screen.getByTestId('banner_search_bar_input') as HTMLInputElement
    await user.type(bannerSearchBarElm, "Test")
    expect(bannerSearchBarElm.value).toBe('Test')
    const gameIconList = screen.queryAllByTestId('game_icon')
    expect(gameIconList.length).toBe(3)
})
