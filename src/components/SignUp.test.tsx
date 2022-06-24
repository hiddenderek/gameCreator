/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import SignUp from './SignUp'
import userEvent from '@testing-library/user-event'

jest.mock('../utils/apicalls', () => {
    return {
        handleApiData: async (path: string, setState: Function, action: string, body: object) => {
            if (path.includes('/games/') && action === "get") {
            
            }
        }
    }
})

beforeEach(async () => {
    render(
        <Router>
            <Provider store={store}>
                <SignUp />
            </Provider>
        </Router>
    )
})

test('Sign up page display', () => {
    const signUpTest = screen.getByText('Sign Up')
    expect(signUpTest).toBeInTheDocument()
})

test('Sign up page user name change', async () => {
    const user = userEvent.setup()
    const userInput = screen.getByTestId('user_input') as HTMLInputElement
    await user.type(userInput, "bob")
    expect(userInput.value).toBe("bob")
})

test('Sign up page password change', async () => {
    const user = userEvent.setup()
    const passwordInput = screen.getByTestId('pswd_input') as HTMLInputElement
    await user.type(passwordInput, "asdf1234$")
    expect(passwordInput.value).toBe("asdf1234$")
})

test('Sign up page confirm password change', async() => {
    const user = userEvent.setup()
    const comfirmPasswordInput = screen.getByTestId('c_pswd_input') as HTMLInputElement
    await user.type(comfirmPasswordInput, "asdf1234$")
    expect(comfirmPasswordInput.value).toBe("asdf1234$")
})

test('Sign up page date of birth change', async () => {
    const dateOfBirthInput = screen.getByTestId('dob_input') as HTMLInputElement
    fireEvent.mouseDown(dateOfBirthInput)
    fireEvent.change(dateOfBirthInput, {target: { value: "1994-12-27"}})
    expect(dateOfBirthInput.value).toBe("1994-12-27")
})

test('Error message check', async () => {
    const user = userEvent.setup()
    const userInput = screen.getByTestId('user_input') as HTMLInputElement
    await user.type(userInput, "bob")
    const passwordInput = screen.getByTestId('pswd_input') as HTMLInputElement
    await user.type(passwordInput, "asdf1234$")
    const comfirmPasswordInput = screen.getByTestId('c_pswd_input') as HTMLInputElement
    await user.type(comfirmPasswordInput, "asdf1234$")
    const dateOfBirthInput = screen.getByTestId('dob_input') as HTMLInputElement
        fireEvent.mouseDown(dateOfBirthInput)
        fireEvent.change(dateOfBirthInput, {target: { value: "1994-12-27"}})

    const errorMessage = screen.queryByTestId('error_message')
    expect(errorMessage).toBeNull()
})


