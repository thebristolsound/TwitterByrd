import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useUserData = (username) =>
  useQuery(['user', username], () => fetchUserData(username),
    {
      enabled: !!username
    }
  )

export const fetchUserData = async (username) => {
  const response = await axios.get(`http://localhost:5000/api/theconsole?command=grabuser&username=${username}`)
  return response.data
}
