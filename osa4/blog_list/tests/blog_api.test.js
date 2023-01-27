const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const blogs = require('./test_blogs')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
  
    const blogObjs = blogs.map(blog => new Blog(blog))
    const promiseArray = blogObjs.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('correct number of blogs is returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(6)
  })
  
test('after posting a blog the number of blogs is increased', async () => {
    const testObject = {
        title: "First class tests version 2",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 4,
    }

    await api
        .post('/api/blogs')
        .send(testObject)

    const response = await api
        .get('/api/blogs')
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(7)
})
  
test('returned blogs have field id', async () => {
    const response = await api
        .get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('posting blog without likes field saves a blog with 0 likes', async () => {
    const testObject = {
        title: "First class tests version 2",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
    }

    await api
        .post('/api/blogs')
        .send(testObject)

    const response = await api
        .get('/api/blogs')
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(7)
})

test('posting blog without url and title returns status code 400', async () => {
    const testObject = {
        author: "Robert C. Martin",
        likes: 4,
    }

    const res = await api
        .post('/api/blogs')
        .send(testObject)
        .expect(400)
})


test('deleting a blog decreases the amount of blogs', async () => {
    const id = "5a422aa71b54a676234d17f8"

    const res = await api
        .delete(`/api/blogs/${id}`)

    const response = await api
        .get('/api/blogs')
    expect(response.body).toHaveLength(5)

})

test('deleting a blog with bad id returns status code 400', async () => {
    const id = "5"

    const res = await api
        .delete(`/api/blogs/${id}`)
        .expect(400)
})


test('updating a blog returns correctly updated blog', async () => {
    const id = "5a422aa71b54a676234d17f8"

    const blog = {
        likes: 20
    }

    const res = await api
        .put(`/api/blogs/${id}`)
        .send(blog)
    
    expect(res.body).toEqual({
        id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 20,
    })

})

test('updating a blog with missing likes field returns 400 status code', async () => {
    const id = "5a422aa71b54a676234d17f8"

    const blog = {
    }

    const res = await api
        .put(`/api/blogs/${id}`)
        .send(blog)
        .expect(400)
})


test('updating a blog with bad id returns status code 400', async () => {
    const id = "5"

    const blog = {
        likes: 20
    }

    const res = await api
        .put(`/api/blogs/${id}`)
        .send(blog)
        .expect(400)
})



afterAll(() => {
    mongoose.connection.close()
  })