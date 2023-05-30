import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {

  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const like = async (updateObject, id) => {
  const url = baseUrl + '/' + id
  const response = await axios.put(url, updateObject)
  return response.data
}

const remove = async (id) => {
  const url = baseUrl + '/' + id
  const config = {
    headers: { Authorization: token },
  }

  const removed = await axios.delete(url, config)
  return removed.data
}

export default { getAll, setToken, create, like, remove }