
import React from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Button, Container, FormControl, FormGroup, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { COLUMN_HEADERS } from '../utils'

const fetchUserData = async (username) => {
  const response = await axios.get(`http://localhost:5000/api/theconsole?command=grabuser&username=${username}`)
  return response.data
}

export default function Root () {
  const [username, setUsername] = React.useState('')
  const [searchInput, setSearchInput] = React.useState('')
  const [formSubmitted, setFormSubmitted] = React.useState(false)

  const query = useQuery(['grabusers', username], () => fetchUserData(username),
    { enabled: !!username && formSubmitted, refetchOnWindowFocus: false, refetchOnMount: false })

  const handleSearchChange = (event) => {
    setUsername('')
    setSearchInput(event.target.value)
    setFormSubmitted(false)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setUsername(searchInput)
    setFormSubmitted(true)
  }

  return (
    <>
      <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden">
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
        <main role="main" className="w-full h-full flex-grow p-3 overflow-auto">
          <Container maxWidth="xl">
            <FormGroup row>
              <FormControl>
                <TextField label="Twitter Username" varient="filled" id="username" type="text" onChange={handleSearchChange} value={searchInput} />
              </FormControl>
              <Button variant="outlined" onClick={handleSearchSubmit} disabled={formSubmitted || !searchInput}>Search</Button>
            </FormGroup>
            {query.error && <div>Error: {query.error.message}</div>}
            {query && (
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  loading={query.isFetching}
                  rows={query.data ?? []}
                  columns={COLUMN_HEADERS}
                  pageSize={50}
                  rowsPerPageOptions={[25, 50, 100]}
                  checkboxSelection
                  disableSelectionOnClick
                />
              </div>
            )}
          </Container>
        </main>
      </div>
      <footer className="bg-indigo-800 mt-auto">
        <div className="px-4 py-3 text-white mx-auto">
          <h1 className="text-2xl hidden sm:block mb-2">The Console</h1>
          <div className="flex">
            <div className="flex-grow flex flex-col">

            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
