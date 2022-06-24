/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import GameBrowser from './GameBrowser'
import Banner from './Banner'
import { renderWithRouter } from '../utils/testHelperFunctions'
import { getAfterLastCharacter } from '../utils/stringParse'

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
            if (path.includes('/games?') && action === "get") {
                const searchString = getAfterLastCharacter({ string: path, character: '/games?' })
                const { mode, direction, search, countgames } = JSON.parse('{"' + decodeURI(searchString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
                const testGameSearch = testGameData.filter((item) => item.game_name.includes(search))
                const testGameSort = testGameSearch.sort((a: fakeGameData, b: fakeGameData) => {
                    const firstVal = mode === "time_created" ? Date.parse(a[mode as string]) : mode === "likes" ? a.likes - a.dislikes : a[mode as string]
                    const secondVal = mode === "time_created" ? Date.parse(b[mode as string]) : mode === "likes" ? b.likes - b.dislikes : b[mode as string]
                    return (firstVal > secondVal ? (direction === "DESC" ? -1 : 1) : (direction === "DESC" ? 1 : -1))
                })
                act(() => {
                    setState ? countgames ? setState(testGameData) : setState(testGameSort) : ""
                })
                return Promise.resolve({
                    data: testGameSort,
                    status: 200
                })
            } else if (path.includes('/actions/like')) {
                const curGameName = path.split('/')[3]
                const curGame = testGameData.filter((item: fakeGameData) => item.game_name === curGameName)[0]
                act(() => {
                    setState ? setState(curGame.likes) : ""
                })
                return Promise.resolve({
                    data: { likes: curGame.likes },
                    status: 200
                })
            } else if (path.includes('/actions/dislike')) {
                const curGameName = path.split('/')[3]
                const curGame = testGameData.filter((item: fakeGameData) => item.game_name === curGameName)[0]
                act(() => {
                    setState ? setState(curGame.dislikes) : ""
                })
                return Promise.resolve({
                    data: { dislikes: curGame.dislikes },
                    status: 200
                })
            } else if (path.includes('/users/')) {
                const curUserId = getAfterLastCharacter({ string: path, character: '/' })
                const curGame = testGameData.filter((item: fakeGameData) => item.userId === curUserId)[0]
                act(() => {
                    setState ? setState() : ""
                })
                return Promise.resolve({
                    data: { username: curGame.username },
                    status: 200
                })
            }
        }
    }
})

beforeEach(async () => {
    await act(async () => {
        renderWithRouter(
            <Router>
                <Provider store={store}>
                    <Banner setProfileData={""} profileData={{ username: "testUser0" }} aspectRatio={1.5} isMobile={false} />
                    <GameBrowser profileData={{ username: "testUser0" }} />
                </Provider>
            </Router>
            , { route: '/games' })
    })
})

test('Game Icon Search', async () => {
    const user = userEvent.setup()
    const bannerSearchBarElm = screen.getByTestId('banner_search_bar_input') as HTMLInputElement
    await user.type(bannerSearchBarElm, "Test")
    expect(bannerSearchBarElm.value).toBe('Test')
    const gameIconList = screen.queryAllByTestId('game_icon')
    expect(gameIconList.length).toBe(3)
})

test('Game Icon Filter', async () => {
    const user = userEvent.setup()
    const bannerSearchBarElm = screen.getByTestId('banner_search_bar_input') as HTMLInputElement
    await user.type(bannerSearchBarElm, "Test")
    expect(bannerSearchBarElm.value).toBe('Test')
    const gameIconList = screen.queryAllByTestId('game_icon')
    expect(gameIconList.length).toBe(3)
    let gameIconName = screen.getByTestId('game_icon_name_0')
    expect(gameIconName.textContent).toBe(testGameData[1].game_name.toUpperCase())
    const gameNameSortElm = screen.getByTestId('sort_by_game_name')
    await user.click(gameNameSortElm)
    gameIconName = screen.getByTestId('game_icon_name_0')
    expect(gameIconName.textContent).toBe(testGameData[2].game_name.toUpperCase())
    const gameLikesSortElm = screen.getByTestId('sort_by_likes')
    await user.click(gameLikesSortElm)
    gameIconName = screen.getByTestId('game_icon_name_0')
    expect(gameIconName.textContent).toBe(testGameData[2].game_name.toUpperCase())
    const searchResultAscButton = screen.getByTestId('change_search_result_asc')
    await user.click(searchResultAscButton)
    gameIconName = screen.getByTestId('game_icon_name_0')
    expect(gameIconName.textContent).toBe(testGameData[0].game_name.toUpperCase())
})
