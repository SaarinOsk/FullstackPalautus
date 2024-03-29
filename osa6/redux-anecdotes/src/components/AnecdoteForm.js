import { useSelector, useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()

    const newAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        dispatch(createAnecdote(content))
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={newAnecdote}>
                <div><input name='anecdote' /></div>
                <button>create</button>
            </form>
        </div>
    )
}


export default AnecdoteForm