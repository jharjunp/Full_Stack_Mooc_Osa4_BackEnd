const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res, next) => {
  Blog.find({}).then(result => {
    res.json(result)
  })
    .catch(error => next(error))
})


blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog.save().then(saved => {
    response.json(saved)
  })
    .catch(error => next(error))
})


/*
blogsRouter.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(returnedPerson => {
      response.json(returnedPerson)
    })
    .catch(error => next(error))
})

blogsRouter.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogsRouter.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

const person = {
    name: body.name,
    number: body.number
  }

Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

*/

module.exports = blogsRouter