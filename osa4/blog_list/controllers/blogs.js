const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  //User.deleteMany({})
  //Blog.deleteMany({})
  const blogs = await Blog.find({}).populate('user', {name: 1, username: 1})
    response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body
    //could have done these with mongoose validations in the schema....
  
    if (!("title" in body) || body.title === undefined) {
      response.status(400).json({error: "no title"})
    }
    else if (!("url" in body) || body.url === undefined) {
      response.status(400).json({error: "no url"})
    }
    else {
      if (!("likes" in body) || body.likes === undefined) {
        body.likes = 0
      }

      const user = await User.findById(body.userId)

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id 
      })
      const result = await blog.save()
      user.blogs = user.blogs.concat(result._id)
      await user.save()

      response.status(201).json(result)
    }    
  })


blogsRouter.delete('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const res = await Blog.findByIdAndRemove(id)
    response.status(204).end()
  } catch (exception) {
    response.status(400).json({error: "bad id"})
  }
    
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  if (!("likes" in body) || body.likes === undefined) {
    response.status(400).json({error: "likes field missing"})
  }

  const blog = {
    likes: body.likes
  }
  try {
    const res = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(res)
  } catch(exception) {
    response.status(400).end()
  }
})
 

module.exports = blogsRouter