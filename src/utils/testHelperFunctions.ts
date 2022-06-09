import { render} from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

export const renderWithRouter = (ui: React.ReactElement, {route = '/'} = {}) => {
    window.history.pushState({}, 'Test page', route)
    return {
      user: userEvent.setup(),
      ...render(ui, {wrapper: Router}),
    }
}