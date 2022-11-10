import React from 'react'
import { screen } from "@testing-library/dom"
import { render } from "@testing-library/react"
import Sidebar from '../Sidebar'

describe('Sidebar', ()=> {
  it('should render the sidebar', async () => {
    render(<Sidebar />)
    const element = await screen.getByTestId('sidebar')
    expect(element)
  })
  test('should render two links for Dashboard and Settings', async () => {
    render(<Sidebar />)
    const sidebarLinks = await screen.getAllByTestId('sidebar-link')
    expect(sidebarLinks).toHaveLength(2)
  })
})
