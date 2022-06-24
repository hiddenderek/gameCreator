/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import GameBrowserPages from './GameBrowserPages'
import { renderWithRouter } from '../utils/testHelperFunctions'

type fakeGameData = {
    game_name: string,
    plays: number,
    likes: number,
    dislikes: number,
    grid_image: string,
    userId: string,
    userName: string,
    [key: string]: any
}

const testGameData: fakeGameData[] = [
    { game_name: "Test Game 1", time_created: "12/27/1994", plays: 120, likes: 40, dislikes: 15, grid_image: "", userId: "asdf1234", userName: "testUser1" },
    { game_name: "Test Game 2", time_created: "9/17/1996", plays: 100, likes: 35, dislikes: 5, grid_image: "", userId: "ghjk5678", userName: "testUser2" },
    { game_name: "Test Game 3", time_created: "5/15/1995", plays: 186, likes: 95, dislikes: 25, grid_image: "", userId: "lzxc9012", userName: "testUser3" },
    { game_name: "Best Game", time_created: "8/7/1997", plays: 500, likes: 105, dislikes: 1, grid_image: "", userId: "vbnm3456", userName: "testUser4" },
    { game_name: "Worst Game", time_created: "11/22/1998", plays: 90, likes: 1, dislikes: 85, grid_image: "", userId: "qwer7890", userName: "testUser4" },
    { game_name: "Mediocre Game", time_created: "10/1/1999", plays: 85, likes: 25, dislikes: 25, grid_image: "", userId: "tyui1234", userName: "testUser4" },
    { game_name: "Ignored game", time_created: "7/4/2010", plays: 2, likes: 0, dislikes: 0, grid_image: "", userId: "opas5678", userName: "testUser5" },
    { game_name: "Test Game 4", time_created: "12/27/1994", plays: 120, likes: 40, dislikes: 15, grid_image: "", userId: "asdf12341", userName: "testUser1" },
    { game_name: "Test Game 5", time_created: "9/17/1996", plays: 100, likes: 35, dislikes: 5, grid_image: "", userId: "ghjk56781", userName: "testUser2" },
    { game_name: "Test Game 6", time_created: "5/15/1995", plays: 186, likes: 95, dislikes: 25, grid_image: "", userId: "lzxc90121", userName: "testUser3" },
    { game_name: "Best Game 1", time_created: "8/7/1997", plays: 500, likes: 105, dislikes: 1, grid_image: "", userId: "vbnm34561", userName: "testUser4" },
    { game_name: "Worst Game 1", time_created: "11/22/1998", plays: 90, likes: 1, dislikes: 85, grid_image: "", userId: "qwer78901", userName: "testUser4" },
    { game_name: "Mediocre Game 1", time_created: "10/1/1999", plays: 85, likes: 25, dislikes: 25, grid_image: "", userId: "tyui12341", userName: "testUser4" },
    { game_name: "Ignored game 1", time_created: "7/4/2010", plays: 2, likes: 0, dislikes: 0, grid_image: "", userId: "opas56781", userName: "testUser5" },
    { game_name: "Test Game 7", time_created: "12/27/1994", plays: 120, likes: 40, dislikes: 15, grid_image: "", userId: "asdf12342", userName: "testUser1" },
    { game_name: "Test Game 8", time_created: "9/17/1996", plays: 100, likes: 35, dislikes: 5, grid_image: "", userId: "ghjk56782", userName: "testUser2" },
    { game_name: "Test Game 9", time_created: "5/15/1995", plays: 186, likes: 95, dislikes: 25, grid_image: "", userId: "lzxc90122", userName: "testUser3" },
    { game_name: "Best Game 2", time_created: "8/7/1997", plays: 500, likes: 105, dislikes: 1, grid_image: "", userId: "vbnm34562", userName: "testUser4" },
    { game_name: "Worst Game 2", time_created: "11/22/1998", plays: 90, likes: 1, dislikes: 85, grid_image: "", userId: "qwer78902", userName: "testUser4" },
    { game_name: "Mediocre Game 2", time_created: "10/1/1999", plays: 85, likes: 25, dislikes: 25, grid_image: "", userId: "tyui12342", userName: "testUser4" },
    { game_name: "Ignored game 2", time_created: "7/4/2010", plays: 2, likes: 0, dislikes: 0, grid_image: "", userId: "opas56782", userName: "testUser5" }
]

let page = 0

const pageDisplayLimit = 3

const gameDisplayLimit = 4

function changePage(newPage: number) {
    page = newPage
}

beforeEach(async () => {
    await act(async () => {
        renderWithRouter(
            <Router>
                <Provider store={store}>
                    <GameBrowserPages page={page} pageList={testGameData} changePage={changePage} gameDisplayLimit={gameDisplayLimit} pageDisplayLimit={pageDisplayLimit} />
                </Provider>
            </Router>
            , { route: '/games' })
    })
})

test('Game Page Browser Populate', async () => {
    const pageCount = screen.queryAllByTestId('page_browser_number')
    expect(pageCount.length).toBe(pageDisplayLimit)
    const leftArrowElm = screen.getByTestId('page_browser_left_arrow')
    expect(leftArrowElm).toBeInTheDocument()
    const rightArrowElm = screen.getByTestId('page_browser_right_arrow')
    expect(rightArrowElm).toBeInTheDocument()
})

test('Game Page Browser Navigate', async () => {
    const user = userEvent.setup()
    const leftArrowButton = screen.getByTestId('page_browser_left_arrow')
    const rightArrowButton = screen.getByTestId('page_browser_right_arrow')
    let pageCount = screen.queryAllByTestId('page_browser_number')
    expect(pageCount[0].textContent).toBe("1")
    await user.click(leftArrowButton)
    pageCount = screen.queryAllByTestId('page_browser_number')
    expect(pageCount[0].textContent).toBe("1")
    await user.click(rightArrowButton)
    pageCount = screen.queryAllByTestId('page_browser_number')
    expect(pageCount[0].textContent).toBe("2")
})