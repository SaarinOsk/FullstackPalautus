import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ( { blog, likeBlog, handleRemove, usr } ) => {

  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showRemove = { display: usr.id===blog.user.id ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    const updateObject = {
      'user': blog.user.id,
      'likes': likes + 1,
      'author': blog.author,
      'title': blog.title,
      'url': blog.url
    }

    await likeBlog(updateObject, blog.id)
    setLikes(likes + 1)
  }

  const handleR = () => {
    if (window.confirm(`Remove blog ${blog.title} ${blog.author}?`)) {
      handleRemove(blog.id)
    }
  }

  return(
    <div style={blogStyle}>
      <div style={hideWhenVisible} className='compact'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} className='view-blog'>view</button>
      </div>
      <div style={showWhenVisible} className='expanded'>
        <div className='blog'>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {likes} <button onClick={handleLike} className='like-blog'>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div style={showRemove} className='remove-div'>
          <button onClick={handleR} className='remove-blog'>remove</button>
        </div>
      </div>
    </div>

  )

}

Blog.PropTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  usr: PropTypes.object.isRequired
}

export default Blog