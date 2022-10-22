
import React from 'react'

import { useQuery } from '@tanstack/react-query'
import { Button, Container, FormControl, FormGroup, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { COLUMN_HEADERS } from '../utils'
import { fetchAccounts, GET_FOLLOWERS, GET_FOLLOWING, GET_MUTUALS } from '../queries/users'
import Sidebar from '../components/Sidebar'

export default function Root () {
  const [username, setUsername] = React.useState('')
  const [searchInput, setSearchInput] = React.useState('')
  const [searchAction, setSearchAction] = React.useState(GET_FOLLOWERS)
  const [formSubmitted, setFormSubmitted] = React.useState(false)

  const query = useQuery(['data', searchAction, username], () => fetchAccounts(username, searchAction),
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

  const handleSearchActionChange = (event) => {
    setFormSubmitted(false)
    setSearchAction(event.target.value)
  }

  return (
    <>
      <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden">
        <div className="sm:w-1/3 md:1/4 lg:w-1/4 w-full flex-shrink p-4">
          <Sidebar />
        </div>
        <main role="main" className="w-full h-full flex-grow p-3 overflow-auto">
          <Container maxWidth="xl" disableGutters>
            <FormGroup row >
              <FormControl>
                <TextField label="Twitter Username" varient="filled" id="username" type="text" onChange={handleSearchChange} value={searchInput} />
              </FormControl>
              <Select
                label="Select an action"
                id="action"
                name="action"
                value={searchAction}
                onChange={handleSearchActionChange}
              >
                <MenuItem value={GET_FOLLOWERS}>Followers</MenuItem>
                <MenuItem value={GET_FOLLOWING}>Following</MenuItem>
                <MenuItem value={GET_MUTUALS}>Mutuals</MenuItem>
              </Select>
              <Button variant="contained" onClick={handleSearchSubmit} disabled={formSubmitted || !searchInput}>Populate</Button>

            </FormGroup>
            {query.error && <div>Error: {query.error.message}</div>}
            {query && (
              <div style={{ minHeight: 700, width: '100%' }}>
                <DataGrid
                  loading={query.isFetching}
                  rows={query.data ?? []}
                  columns={COLUMN_HEADERS}
                  pageSize={50}
                  rowsPerPageOptions={[25, 50, 100]}
                  headerHeight={50}

                  components={
                    {
                      Toolbar: CustomToolbar
                    }
                  }
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

const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarExport />
    <GridToolbarQuickFilter />
  </GridToolbarContainer>
)
