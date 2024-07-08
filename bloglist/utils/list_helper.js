const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {

  if (blogs.length === 0) return null

  const reducer = (favorite, current) => current.likes > favorite.likes ? current : favorite
  const result = blogs.reduce(reducer, blogs[0])
  const formattedResult = {
    title: result.title,
    author: result.author,
    likes:  result.likes
  }
  return formattedResult
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}