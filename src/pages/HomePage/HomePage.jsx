import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentWeather, fetchForecastWeather } from '../../components/WeatherSlice';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import target from '../../assests/images/target.jpeg';

const MaterialUISwitch = styled(Switch)(({}) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#8796A5',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 10,
  },
}));

const HomePage = () => {
  const dispatch = useDispatch();
  const { current, forecast, loading, error, location:location } = useSelector(
    (state) => state.weather
  );

  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.style.backgroundColor = darkMode ? '#ffffff' : '#121212';
    document.body.style.color = darkMode ? '#000000' : '#ffffff';
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(fetchCurrentWeather(searchQuery));
      dispatch(fetchForecastWeather({ location: searchQuery, days: 5 }));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };



  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = `${latitude},${longitude}`;
          dispatch(fetchCurrentWeather(userLocation)); 
          dispatch(fetchForecastWeather({ location:userLocation, days: 5 })); 
        },
        (error) => {
          alert('Error getting current location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  
  
  

  useEffect(() => {
    dispatch(fetchCurrentWeather('India'));
    dispatch(fetchForecastWeather({ location: 'India', days: 5 }));
  }, [dispatch]);

  // debug
  useEffect(()=>{
    console.log("weather data is: ",current)
  },[current])

  
    console.log(current)
  

  return (
    <div>
      {/* Header */}
      <div className={`flex justify-around mt-2 p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <FormGroup>
          <FormControlLabel
            control={
              <MaterialUISwitch
                sx={{ m: 1 }}
                checked={darkMode}
                onChange={toggleMode}
              />
            }
            label={darkMode ? 'Dark mode' : 'Light mode'}
          />
        </FormGroup>
        <div className={`border-2 w-[60%] ${darkMode ? 'border-gray-600' : 'border-gray-400'} h-12 flex rounded-3xl m-2`}>
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for your preferred city"
            className={`min-w-[95%] border-transparent rounded-2xl outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'}`}
          />
        </div>
        <div
          className={`flex w-fit h-12 items-center rounded-3xl p-2 ${darkMode ? 'bg-green-700' : 'bg-green-500'} text-white`}
          onClick={handleCurrentLocation}
        >
          <img src={target} alt="Current location" className="w-6 h-6 rounded-full" />
          <button className="ml-2 font-medium text-lg">Current Location</button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex flex-col items-center mb-5 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex mt-10">
          {/* City and Date Card */}
          <div
            className={`w-[510px] h-[330px] ml-20 border-2 rounded-[30px] flex flex-col items-center align-middle shadow-2xl ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}
          >
            <h1 className="font-extrabold text-3xl mt-5">
              {location?.name || 'Loading...'}
            </h1>
            <h1 className="font-extrabold text-8xl mt-12">
              {location?.localtime
                ? new Date(location.localtime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '--:--'}
            </h1>

            <p className="font-bold text-2xl mt-5">
              {location?.localtime
                ? new Date(location.localtime).toLocaleDateString()
                : 'Loading Date...'}
            </p>
          </div>

          {/* Weather Information Card */}
          <div
            className={`w-[780px] h-[330px] border-2 rounded-[30px] ml-[55px] p-5 shadow-2xl ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}
          >
            <h2 className="text-2xl font-bold mb-2">Current Weather</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {current && (
              <div className="flex justify-between items-center h-full px-6">
                <div>
                  <p className="text-6xl font-bold">{current.temp_c}°C</p>
                  <p className="text-lg mt-2">Feels like: {current.feelslike_c}°C</p>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={`https:${current.condition.icon}`}
                    alt="Weather Icon"
                    className="w-50 h-50"
                  />
                  <p className="text-lg">{current.condition.text}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>💧 Humidity: {current.humidity}%</div>
                  <div>🌬 Wind Speed: {current.wind_kph} kph</div>
                  <div>🌡 Pressure: {current.pressure_mb} hPa</div>
                  <div>☀️ UV Index: {current.uv}</div>
                </div>
              </div>

          )}
        </div>
      </div>

      <div className='flex mt-12'>
        {/* Card 3 */}
        <div
        className={`w-[414px] h-[366px] ml-20 border-2 rounded-[30px] shadow-2xl ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`}
      >
        <div className="place-items-center mt-5">
          <h1 className="font-bold text-2xl">5-Day Forecast</h1>
        </div>
        <div className="grid grid-cols-1 gap-3 mt-4 px-4 overflow-y-auto h-[260px]">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {forecast && forecast.length > 0 ? (
            forecast.map((day) => (
              <div
                key={day.date}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <div>
                  <h3 className="text-sm font-bold">{day.date}</h3>
                  <p className="text-sm">{day.day.condition.text}</p>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={`https:${day.day.condition.icon}`}
                    alt="Weather Icon"
                    className="w-8 h-8"
                  />
                  <div>
                    <p className="text-sm">
                      🌡 {day.day.maxtemp_c}°C / {day.day.mintemp_c}°C
                    </p>
                    <p className="text-sm">💧 {day.day.avghumidity}%</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No forecast data available.</p>
          )}
        </div>
        </div>

        {/* Card 4 */}
        <div className={`w-[870px] h-[366px] ml-[61px] border-2 rounded-[30px] shadow-2xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h1 className="text-2xl font-bold text-center mt-4">Hourly Forecast</h1>
        <div className="grid grid-cols-4 gap-4 p-4 overflow-y-auto h-[300px]">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {forecast && forecast.length > 0 ? (
          forecast[0].hour.map((hour, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-3 border rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <p className="font-bold text-sm">{new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <img src={`https:${hour.condition.icon}`} alt="Weather Icon" className="w-12 h-12" />
              <p className="text-sm">{hour.temp_c}°C</p>
              <p className="text-xs">🌧 {hour.precip_mm} mm</p>
              <p className="text-xs">💨 {hour.wind_kph} kph</p>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-center">No hourly forecast available.</p>
        )}
        </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomePage;
