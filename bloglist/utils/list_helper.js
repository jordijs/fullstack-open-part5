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
  //finds out which blog has the most likes. If there are many top favorites, it is enough to return one of them.
  return result
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}