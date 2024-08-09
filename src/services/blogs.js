import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  const blogs = response.data
  blogs.sort((a, b) => b.likes - a.likes)
  return blogs
}

const create = async newObject => {
  const config = {
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
  const response = await axios.put(url, blogObject)
  return response.data
}

export default { setToken, getAll, create, update }