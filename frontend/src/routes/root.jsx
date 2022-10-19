
import React from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Box, Button, Container, FormControl, FormControlLabel, FormGroup, Input, InputLabel } from '@mui/material'

const fetchUserData = async (username) => {
  const response = await axios.get(`http://localhost:5000/api/theconsole?command=grabuser&username=${username}`)
  return response.data
}

export const useUserData = (username) =>
  useQuery(['user', username], () => fetchUserData(username),
    { enabled: !!username })



export default function Root() {
  return (
    <>
      <Page>
        <Sidebar />
        <Content />
      </Page>
      <Footer />
    </>
  )
}
// Subcomponents

export const Sidebar = () => (
  <div className="sm:w-1/3 md:1/4 w-full flex-shrink flex-grow-0 p-4">
    <div className="sticky top-0 p-4 bg-gray-100 rounded-xl w-full">
      <ul className="flex sm:flex-col overflow-hidden content-center justify-between">
        <li className="py-2 hover:bg-indigo-300 rounded">
          <a className="truncate" href="/">
            <img alt="dashboard" src="//cdn.jsdelivr.net/npm/heroicons@1.0.1/outline/home.svg" className="w-7 sm:mx-2 mx-4 inline" />
            <span className="hidden sm:inline">Dashboard</span>
          </a>
        </li>
        <li className="py-2 hover:bg-indigo-300 rounded">
          <a className="truncate" href="/settings">
            <img alt="settings" src="//cdn.jsdelivr.net/npm/heroicons@1.0.1/outline/cog.svg" className="w-7 sm:mx-2 mx-4 inline" /> <span className="hidden sm:inline">Settings</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
)

const Footer = () => {
  return (
    <footer className="bg-indigo-800 mt-auto">
      <div className="px-4 py-3 text-white mx-auto">
        <h1 className="text-2xl hidden sm:block mb-2">The Console</h1>
        <div className="flex">
          <div className="flex-grow flex flex-col">

          </div>
        </div>
      </div>
    </footer>
  )
}

const Page = ({ children, ...rest }) => (
  <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden" {...rest}>
    {children}
  </div>
)

const Content = () => {
  return (
    <main role="main" className="w-full h-full flex-grow p-3 overflow-auto">
      <Container maxWidth="xl">
        <FormGroup row>
          <FormControl>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input id="username" type="text" value="" />
          </FormControl>
          <Button variant="outlined"onClick={() => { console.log('clicked') }}>Search</Button>
        </FormGroup>

      </Container>
    </main>
  )
}
