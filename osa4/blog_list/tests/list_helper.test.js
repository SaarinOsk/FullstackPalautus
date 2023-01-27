const listHelper = require('../utils/list_helper')
const blogs = require('./test_blogs')


test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total Likes', () => {
    test('of empty list is 0', () => {
      expect(listHelper.totalLikes([])).toBe(0)
    })

    test('when list has only one the likes equal the likes of that', () => {
        expect(listHelper.totalLikes([blogs[0]])).toBe(blogs[0].likes)
    })
    
  
    test('of many is calculated right', () => {
      expect(listHelper.totalLikes(blogs)).toBe(36)
    })
  
})

describe('favorite blog', () => {
    test('of empty list is empty object', () => {
      expect(listHelper.favoriteBlog([])).toEqual({})
    })

    test('when list has only one that blog is returned', () => {
        expect(listHelper.favoriteBlog([blogs[0]])).toEqual(blogs[0])
    })
    
  
    test('of many is calculated right', () => {
      expect(listHelper.favoriteBlog(blogs)).toEqual(blogs[2])
    })
  
})

describe('most blogs', () => {
    test('of many is calculated right', () => {
      expect(listHelper.mostBlogs(blogs)).toEqual({
        author: "Robert C. Martin",
        blogs: 3
      })
    })

    test('when list has only one entry it works', () => {
        expect(listHelper.mostBlogs([blogs[0]])).toEqual({
            author: blogs[0].author,
            blogs: 1
        })
    })
  
    test('of empty list is empty object', () => {
      expect(listHelper.mostBlogs([])).toEqual({})
    })
})

describe('most likes', () => {
    test('of many is calculated right', () => {
      expect(listHelper.mostLikes(blogs)).toEqual({
        author: "Edsger W. Dijkstra",
        likes: 17
      })
    })

    test('when list has only one entry it works', () => {
        expect(listHelper.mostLikes([blogs[0]])).toEqual({
            author: blogs[0].author,
            likes: 7
        })
    })
  
    test('of empty list is empty object', () => {
      expect(listHelper.mostLikes([])).toEqual({})
    })
})