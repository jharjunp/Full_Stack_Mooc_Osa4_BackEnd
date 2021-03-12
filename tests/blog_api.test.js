const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('ID exists', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0]).toBeDefined()
})

/*
test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
})
*/

test('a valid user can be created', async () => {
  const newUser =
  {
    username: 'Heebo3',
    name: 'Saku Mahtava',
    password: 'Sall'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
})

test('a non-unique user cannt be created', async () => {
  const newUser =
  {
    username: 'Heebo3',
    name: 'Saku Mahtava',
    password: 'Sall'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('a user cannt be created with too short password', async () => {
  const newUser =
  {
    username: 'Heebo3',
    name: 'Saku Mahtava',
    password: 'Sal'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})


test('a valid blog can be added ', async () => {
  const newBlog =
    {
      title: 'sdsdsdsdfsdf',
      author: 'Jari The Great',
      url: 'http://google.com',
      likes: 0
    }
  const login =
    {
      username: 'HemmoP',
      password: 'Salainen'
    }

  const logIn = await api
    .post('/api/login')
    .send(login)
    .expect(200)

  const bear = 'bearer '
  const loggedInToken = bear.concat(logIn.body.token)

  await api
    .post('/api/blogs')
    .set ('Authorization', loggedInToken )
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  expect(contents).toContain(
    'sdsdsdsdfsdf'
  )
})

test('a valid blog can´t be added without valid credentials', async () => {
  const newBlog =
    {
      title: 'sdsdsdsdfsdf',
      author: 'Jari The Great',
      url: 'http://google.com',
      likes: 0
    }

  const loggedInToken = 'HumppaJumppa'

  await api
    .post('/api/blogs')
    .set ('Authorization', loggedInToken )
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

})

test('a blog can be added with likes undefined ', async () => {
  const newBlog =
    {
      title: 'sdsdsdsdfsdf - 2',
      author: 'Jari The Great',
      url: 'http://google.com',
    }

  const login =
    {
      username: 'HemmoP',
      password: 'Salainen'
    }

  const logIn = await api
    .post('/api/login')
    .send(login)
    .expect(200)

  const bear = 'bearer '
  const loggedInToken = bear.concat(logIn.body.token)

  await api
    .post('/api/blogs')
    .set ('Authorization', loggedInToken )
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  expect(contents).toContain(
    'sdsdsdsdfsdf - 2'
  )
})

test('blog without content is not added', async () => {
  const newBlog = {
    author: 'Jari The Great',
  }

  const login =
  {
    username: 'HemmoP',
    password: 'Salainen'
  }

  const logIn = await api
    .post('/api/login')
    .send(login)
    .expect(200)

  const bear = 'bearer '
  const loggedInToken = bear.concat(logIn.body.token)

  await api
    .post('/api/blogs')
    .set ('Authorization', loggedInToken )
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  const login =
  {
    username: 'HemmoP',
    password: 'Salainen'
  }

  const logIn = await api
    .post('/api/login')
    .send(login)
    .expect(200)

  const bear = 'bearer '
  const loggedInToken = bear.concat(logIn.body.token)

  console.log('blogToDelete: ', blogToDelete.id)

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set ('Authorization', loggedInToken )
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const contents = blogsAtEnd.map(r => r.title)

  expect(contents).not.toContain(blogToDelete.title)
})

test('a blog can be changed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToChange = blogsAtStart[0]
  blogToChange.likes = (666)

  await api
    .put(`/api/blogs/${blogToChange.id}`)
    .send(blogToChange)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length
  )

  expect(blogsAtEnd[0].likes).toBe(666)
})

afterAll(() => {
  mongoose.connection.close()
})