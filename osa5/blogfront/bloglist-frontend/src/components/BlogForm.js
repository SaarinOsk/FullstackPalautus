import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {

  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    const blog = {
      title,
      author,
      url
    }
    await createBlog(blog)
    setAuthor('')
    setUrl('')
    setTitle('')
  }

  return(
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          id='title'
        />
      </div>
      <div>
        author
        <input
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          id='author'
        />
      </div>
      <div>
        url
        <input
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          id='url'
        />
      </div>

      <button type="submit" id='submit-blog'>create</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm