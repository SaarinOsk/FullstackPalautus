import { useState, useEffect } from 'react'
import axios from 'axios'

const Input = ({text, handleChange, value}) => {
  return (
    <div>
      {text}<input value={value} onChange={handleChange} />
    </div>
  )
}

const Countries = ({countries, setFilter}) => {
  if (countries.length === 1) {
    const c = countries[0]
    console.log(c)
    

    const latlng = c.capitalInfo.latlng

    

    return (
      <div>
        <h2>{c.name.common}</h2>
        <p>capital {c.capital}</p>
        <p>area {c.area}</p>
        <h4>languages: </h4>
        <ul>
          {Object.values(c.languages).map(language => 
            <li key={language}>{language}</li>
          )}
        </ul>
        
        <img src={c.flags.png} />
      </div>
      
    )
  }

  else {

    return (
      <div>
        {countries.map(country => 
          <div key={country.name.official}>
            {country.name.common}
            <button onClick={() => setFilter(country.name.common)}>show</button>
          </div>
        )}
      </div>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')

  const api_key = ''
  console.log(api_key)
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))  
  }, [])
  

  /*useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={${api_key}}`)
      .then(response => console.log(response.data))  
  })
  */


  const handleFilter = (event) => {
    setNewFilter(event.target.value)
  }
  


  const countriesToShow = () => {
    const realFilter = newFilter.toLowerCase()

    const filtered = countries.filter(p => p.name.common.toLowerCase().includes(realFilter))
    if(filtered.length < 10) {
      return filtered
    }
    else {return []}
  }


  return (
    <div>
      <Input text={"find countries"} value={newFilter} handleChange={handleFilter} />
      <Countries countries={countriesToShow()} setFilter={setNewFilter} />
    </div>
  )
}

export default App