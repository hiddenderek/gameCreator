/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import Banner from './Banner'
import { renderWithRouter } from '../utils/testHelperFunctions'
import userEvent from '@testing-library/user-event'
import { setGameName } from '../features/gameData/gameData-slice'

const dispatch = store.dispatch

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

