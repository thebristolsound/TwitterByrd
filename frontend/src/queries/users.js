
import axios from 'axios'
import { parseTableRows } from '../utils'

export const GET_FOLLOWERS = 'get-followers'
export const GET_FOLLOWING = 'get-following'
export const GET_MUTUALS = 'get-mutuals'

export const fetchAccounts = async (username, command) => {
  const response = await axios.get(`http://localhost:5000/api/theconsole?command=${command}&username=${username}`)
  return parseTableRows(response.data)
}
