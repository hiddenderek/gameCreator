/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, render, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import Banner from './Banner'
import { removeHealth } from '../features/character/character-slice'
import { userData } from '../app/types'
import { renderWithRouter } from '../utils/testHelperFunctions'
import userEvent from '@testing-library/user-event'
import { setGameName } from '../features/gameData/gameData-slice'

const dispatch = store.dispatch

//total score == high scores achieved
//score count == total likes recieved
//play count == total plays recieved

const testUserData: userData[] = [
    { username: "testUser1", total_score: 15, score_count: 0, play_count: 968 },
    { username: "testUser2", total_score: 0, score_count: 2, play_count: 150 },
    { username: "testUser3", total_score: 12, score_count: 1, play_count: 557 },
    { username: "testUser4", total_score: 27, score_count: 4, play_count: 54 },
    { username: "testUser5", total_score: 7, score_count: 769, play_count: 7 },
    { username: "testUser6", total_score: 48, score_count: 19, play_count: 228 },
    { username: "testUser7", total_score: 9, score_count: 75, play_count: 0 },
    { username: "testUser8", total_score: 6, score_count: 259, play_count: 15 },
    { username: "testUser9", total_score: 1, score_count: 150, play_count: 27 },
    { username: "testUser10", total_score: 83, score_count: 102, play_count: 193 }
]

jest.mock('../utils/apicalls', () => {
    return {
        handleApiData: async (path: string, setState: Function, action: string, body: object) => {
            if (path.includes('/actions/')) {
                act(() => {
                    setState ? setState() : ""
                })
                return Promise.resolve({
                    data: {},
                    status: 200
                })
            } else if (path.includes('/action')) {
                act(() => {
                    setState ? setState() : ""
                })
                return Promise.resolve({
                    data: "",
                    status: 200
                })
            }
        }
    }
})

test('Search Input', async () => {
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <Banner profileData={{ username: "testUser0" }} />
            </Provider>
        </Router>
        , { route: '/games' })
    const user = userEvent.setup()
    const bannerSearchBarElm = screen.getByTestId('banner_search_bar_input') as HTMLInputElement
    await user.type(bannerSearchBarElm, "Test Search")
    expect(bannerSearchBarElm.value).toBe("Test Search")
})

describe("User Ratings", () => {
    dispatch(setGameName('testGame1'))
    beforeEach(() => {
        renderWithRouter(
            <Router>
                <Provider store={store}>
                    <Banner profileData={{ username: "testUser0" }} aspectRatio = {1.5} />
                </Provider>
            </Router>
            , { route: '/games/testGame1' })
    })

    test('Like', async () => {
        const user = userEvent.setup()
        const bannerLikeButton = screen.getByTestId('banner_like_btn')
        expect(bannerLikeButton).not.toHaveClass('voteSelected')
        await user.click(bannerLikeButton)
        expect(bannerLikeButton).toHaveClass('voteSelected')
    })

    test('Dislike', async () => {
        const user = userEvent.setup()
        const bannerDislikeButton = screen.getByTestId('banner_dislike_btn')
        expect(bannerDislikeButton).not.toHaveClass('voteSelected')
        await user.click(bannerDislikeButton)
        expect(bannerDislikeButton).toHaveClass('voteSelected')
    })

})

