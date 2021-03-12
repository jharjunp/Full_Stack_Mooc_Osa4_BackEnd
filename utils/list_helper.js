const _ = require('lodash')

const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.length === 0
    ? 0
    : blogs.map (blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  return blogs.find (blog => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  const summary =
    _.chain(blogs)
      .countBy('author')
      .toPairs()
      .max(_.last)
      .value()

  return {
    'author': summary[0],
    'blogs': summary[1]
  }
}

const mostLikes = (blogs) => {
  const countLikes =
    _(blogs)
      .groupBy('author')
      .map((blog, key) => ({
        'author': key,
        'likes': _.sumBy(blog, 'likes') }))
      .value()

  const toReturn =
    _.chain(countLikes)
      .sortBy('likes')
      .toPairs()
      .max(_.last)
      .value()

  return toReturn[1]
}

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes}