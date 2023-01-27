const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const User = require('../models/user')

const api = supertest(app)

const testUsers = [
    {
        username: "test111",
        password: "pass321",
        name: "test",
      },
      {
        username: "test222",
        password: "pass123",
        name: "test2",
      },
]

beforeEach(async () => {
    await User.deleteMany({})
  
    const userObjs = testUsers.map(test => new User(test))
    const promiseArray = userObjs.map(user => user.save())
    await Promise.all(promiseArray)
})

test('correct number of users is returned', async () => {
    const response = await api
      .get('/api/users')
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(2)
})

test('after posting a user the number of users is increased', async () => {
    const testObject = {
        username: "test333",
        password: "pass123",
        name: "test3",
    }

    await api
        .post('/api/users')
        .send(testObject)

    const response = await api
        .get('/api/users')
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(3)
})
  

test('after posting invalid users the number of users is NOT increased', async () => {
    const testObject1 = {
        username: "test333",
        name: "test3",
    }

    const testObject2 = {
        username: "te",
        password: "pass123",
        name: "test3",
    }

    const testObject3 = {
        username: "test222",
        password: "pass123",
        name: "test3",
    }

    await api
        .post('/api/users')
        .send(testObject1)
        .expect(400)

    
    await api
        .post('/api/users')
        .send(testObject2)
        .expect(400)

    await api
        .post('/api/users')
        .send(testObject3)
        .expect(400)


    const response = await api
        .get('/api/users')
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(2)
})
  

