import { useState } from 'react'
import { useField } from './hooks'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useMatch,
  useNavigate
} from 'react-router-dom'

const Menu = ({anecdotes, addNew}) => {
  const padding = {
    paddingRight: 5
  }

  const [notification, setNotification] = useState('')

  const match = useMatch('/anecdotes/:id')

  const anecdote = match 
    ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
    : null
  
  const handleSubmit = (e, content, author, info) => {
    e.preventDefault()
    addNew({
      content,
      author,
      info,
      votes: 0
    })
    setNotification(`A new anecdote "${content}" created!`);
    setTimeout(() => setNotification(''), 5000);
  }

  return (
    <div>
      <div>
        <Link href='#' style={padding} to="/">anecdotes</Link>
        <Link href='#' style={padding}to="/create new">create new</Link>
        <Link href='#' style={padding}to="/about">about</Link>
      </div>
      
      <p>{notification}</p>

      <Routes> 
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes}/>}/>
        <Route path="/anecdotes/:id" element={<AnecdoteDetail anecdote={anecdote}/>}/>
        <Route path="/create new" element={<CreateNew handleSubmit={handleSubmit}/>}/>
        <Route path="/about" element={<About />}/>
      </Routes>
      </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
      <li key={anecdote.id}>
        <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const AnecdoteDetail = ({ anecdote }) => {
  console.log(anecdote)

  return(
    <div>
      <h2>{anecdote.content}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more infomation see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const navigate = useNavigate()

  const content = useField('text');
  const author = useField('text');
  const info = useField('text');


  const submitAndNavigate = (e, content, author, info) => {
    props.handleSubmit(e, content, author, info)
    navigate('/')
  }

  const handleReset = () => {
    content.reset();
    author.reset();
    info.reset();
  }


  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={(e) => submitAndNavigate(e, content.value, author.value, info.value)}>
        <div>
          content
          <input {...content.inputProps}/>
        </div>
        <div>
          author
          <input {...author.inputProps} />
        </div>
        <div>
          url for more info
          <input {...info.inputProps}/>
        </div>
        <button>create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Router>
        <Menu anecdotes={anecdotes} addNew={addNew}/>
      </Router>
      <Footer />
    </div>
  )
}

export default App
