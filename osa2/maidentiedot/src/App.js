import { useState, useEffect } from 'react'
import axios from 'axios'
const App = () => {
  return (
    <Sum a={1} b={2} />
  )
}
const Sum = (props) => {
  const { a, b } = props
  return(
    <div>
      {a} + {b} = {a + b}
     </div>
  )
}
export default App
