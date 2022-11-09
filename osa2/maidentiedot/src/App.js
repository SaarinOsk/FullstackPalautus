import { useState, useEffect } from 'react'
import axios from 'axios'

const Input = ({text, handleChange, value}) => {
  return (
    <div>
      {text}<input value={value} onChange={handleChange} />
    </div>
  )
}

const Countries = ({countries, setFilter, weatherData}) => {
  if (countries.length === 1) {
    const c = countries[0]
    console.log(weatherData)
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

        <h2>Weather in {c.capital}</h2>
        <p>temperature {weatherData.main.temp} Celsius</p>
        <img  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} />
        <p>wind {weatherData.wind.speed}</p>
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
  const [currentLatLong, setLatLong] = useState([0.0, 0.0])
  const [weatherData, setWeatherData] = useState({})

  const api_key = '710bec8a8d60106dbf45caa4ffc3e5ee'

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))  
  }, [])
  
  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${currentLatLong[0]}&lon=${currentLatLong[1]}&appid=${api_key}`)
      .then(response => setWeatherData(response.data))  
  }, [currentLatLong])

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

  useEffect(() => {if(countriesToShow().length === 1) {setLatLong(countriesToShow()[0].capitalInfo.latlng)}})

  return (
    <div>
      <Input text={"find countries"} value={newFilter} handleChange={handleFilter} />
      <Countries countries={countriesToShow()} setFilter={setNewFilter} weatherData={weatherData} />
    </div>
  )
}

export default App