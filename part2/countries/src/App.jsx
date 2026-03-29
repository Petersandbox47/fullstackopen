import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital, latlng }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    if (!latlng || !apiKey) return
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&appid=${apiKey}&units=metric`
      )
      .then((res) => setWeather(res.data))
  }, [latlng, apiKey])

  if (!weather) return null

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetail = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>capital {country.capital?.[0]}</p>
    <p>area {country.area}</p>
    <h3>languages:</h3>
    <ul>
      {Object.values(country.languages || {}).map((lang) => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt={`flag of ${country.name.common}`} width={150} />
    <Weather capital={country.capital?.[0]} latlng={country.latlng} />
  </div>
)

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [shown, setShown] = useState(null)

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then((res) => setCountries(res.data))
  }, [])

  const matches = search
    ? countries.filter((c) =>
        c.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const handleShow = (country) =>
    setShown(shown?.name.common === country.name.common ? null : country)

  return (
    <div>
      <div>
        find countries <input value={search} onChange={(e) => { setSearch(e.target.value); setShown(null) }} />
      </div>

      {search && matches.length > 10 && <p>Too many matches, specify another filter</p>}

      {search && matches.length <= 10 && matches.length > 1 && (
        <ul>
          {matches.map((c) => (
            <li key={c.cca3}>
              {c.name.common}{' '}
              <button onClick={() => handleShow(c)}>
                {shown?.name.common === c.name.common ? 'hide' : 'show'}
              </button>
              {shown?.name.common === c.name.common && <CountryDetail country={c} />}
            </li>
          ))}
        </ul>
      )}

      {search && matches.length === 1 && <CountryDetail country={matches[0]} />}
    </div>
  )
}

export default App
