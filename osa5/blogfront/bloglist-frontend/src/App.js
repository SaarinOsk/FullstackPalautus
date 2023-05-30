import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const Notification = ({ text, color }) => {
  if (text === null) {
    return null
  }

  const notifStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={notifStyle}>
      {text}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  //const [color, setColor] = useState('green')
  const color = 'green'

  const blogSort = (blogsToSort) => {
    return blogsToSort.sort((a, b) => b.likes - a.likes)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogSort(blogs) )
    )
  }, [])

  useEffect(() => {
    const loggedBlogUser = window.localStorage.getItem('loggedBlogUser')
    if (loggedBlogUser) {
      const user = JSON.parse(loggedBlogUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification text={errorMessage} color={color} />

        <h2>Login in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value) } id='username' />
          </div>
          <div>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value) } id='password' />
          </div>
          <div>
            <button type="submit" id='login-button' >login</button>
          </div>
        </form>
      </div>
    )
  }



  const createBlog = async (blogObject) => {

    const newBlog = await blogService.create(blogObject)
    newBlog.user = user
    blogFormRef.current.toggleVisibility()
    setBlogs(blogSort(blogs.concat(newBlog)))
    setErrorMessage(`New blog ${blogObject.title} by ${blogObject.author} added!`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleLike = async (updateObject, id) => {
    const updated = await blogService.like(updateObject, id)
    const blogs = await blogService.getAll()
    setBlogs(blogSort(blogs))
    return updated
  }

  const handleRemove = async (id) => {

    await blogService.remove(id)
    setBlogs(blogSort(blogs.filter(b => b.id !== id)))
    setErrorMessage('Blog removed!')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }


  return (
    <div>
      <Notification text={errorMessage} color={color} />
      <h2>blogs</h2>
      <p>Logged in as {user.name} </p>
      <button id='logout' onClick={() => {
        window.localStorage.removeItem('loggedBlogUser')
        blogService.setToken(null)
      }} >
        logout
      </button>
      <h2>new blog</h2>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={handleLike} handleRemove={handleRemove} usr={user}/>
      )}
    </div>
  )
}

export default App