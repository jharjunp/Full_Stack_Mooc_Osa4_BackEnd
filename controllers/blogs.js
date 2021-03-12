const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.
    find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog ({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: user._id
  })
  if(!blog.likes) {
    blog.set('likes', 0)
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.json(savedBlog.toJSON())
})

/*
blogsRouter.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(returnedPerson => {
      response.json(returnedPerson)
    })
    .catch(error => next(error))
})
*/
blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  console.log('decodedToken: ', decodedToken)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  //const user = await User.findById(decodedToken.id)

  const blog = await Blog.findById(req.params.id)

  if ( blog.user.toString() === decodedToken.id.toString()) {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } else {
    res.status(401).end()
  }
})

blogsRouter.put('/:id', async (req, res) => {

  const blog =
    {
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes
    }

  const newBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.json(newBlog.toJSON())
})

module.exports = blogsRouter