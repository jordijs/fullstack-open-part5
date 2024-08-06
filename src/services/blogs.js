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
  const config =  {
    headers: { Authorization: token }
  }
  
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async editedBlog => {
  const url = `${baseUrl}/${editedBlog.id}`
  const blogObject = {
    user: editedBlog.user.id,
    likes: editedBlog.likes,
    author: editedBlog.author,
    title: editedBlog.title,
    url: editedBlog.url
  }
  console.log('url', url)
  console.log('editedBlog', editedBlog)
  console.log('blogObject', blogObject)
  console.log('config', config)

  const response = await axios.put(url, editedBlog, config)
  return response.data

}

export default { setToken, getAll, create, update }