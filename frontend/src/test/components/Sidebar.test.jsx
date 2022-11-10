import { render, screen, userEvent } from '../utils/test-utils'

describe('Sidebar', () => {
  it('should render the sidebar', () => {
    render(<Sidebar />)
    expect(screen.getByText('Dashbaord')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
