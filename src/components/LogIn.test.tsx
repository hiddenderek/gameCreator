/**
 * @jest-environment jsdom
 */
 import React from 'react'
 import { render, screen } from '@testing-library/react'
 import { Provider } from 'react-redux'
 import { store } from '../app/store'
 import LogIn from './LogIn'
 import { BrowserRouter as Router } from 'react-router-dom'
 import userEvent from '@testing-library/user-event'
 
 beforeEach(() => {
     render(
         <Router>
             <Provider store={store}>
                 <LogIn/>
             </Provider>
         </Router>
     )
 })
 
 test('Enter user name', async ()=>{
     const user = userEvent.setup()
     const loginInput = screen.getByTestId('user_login_input') as HTMLInputElement
     await user.type(loginInput, 'bob')
     expect(loginInput.value).toBe('bob')
 })
 
 test('Enter password', async ()=>{
     const user = userEvent.setup()
     const passwordInput = screen.getByTestId('pswd_login_input') as HTMLInputElement
     await user.type(passwordInput, 'asdf1234$')
     expect(passwordInput.value).toBe('asdf1234$')
 })