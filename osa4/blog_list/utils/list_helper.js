const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    let tot = 0
    blogs.forEach(blog => {
        tot += blog.likes
    });
    return tot
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0) {
        return {}
    }
    let best = blogs[0]
    blogs.forEach(blog => {
        if(blog.likes > best.likes) {
            best = blog
        }
    })
    return best
}   

const mostBlogs = (blogs) => {
    const grouped = Object.entries(lodash.groupBy(blogs, 'author'))
    if(grouped.length === 0) {
        return {}
    }
    let best = grouped[0]
    grouped.forEach(pair => {
        if(pair[1].length > best[1].length) {
            best = pair
        }
    })
    return {
        author: best[0],
        blogs: best[1].length
    }
      
}

const mostLikes = (blogs) => {
    const grouped = Object.entries(lodash.groupBy(blogs, 'author'))
    if(grouped.length === 0) {
        return {}
    }

    let best = grouped[0]
    grouped.forEach(pair => {
        if(totalLikes(pair[1]) > totalLikes(best[1])) {
            best = pair
        }
    })
    return {
        author: best[0],
        likes: totalLikes(best[1])
    }
      
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }