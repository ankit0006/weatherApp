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
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
        {/* Header */}
        <div className={`flex flex-wrap md:flex-nowrap items-center justify-between p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
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
          <div
            className={`flex items-center border-2 rounded-3xl px-4 py-2 w-full md:w-1/2 ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-400 bg-gray-50'}`}
          >
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for your preferred city"
              className="w-full border-transparent rounded-xl outline-none bg-transparent text-sm md:text-base"
            />
          </div>
          <div
            className={`flex items-center rounded-3xl px-4 py-2 mt-2 md:mt-0 cursor-pointer ${darkMode ? 'bg-green-700' : 'bg-green-500'} text-white`}
            onClick={handleCurrentLocation}
          >
            <img src={target} alt="Current location" className="w-6 h-6 rounded-full" />
            <button className="ml-2 font-medium text-sm md:text-lg">Current Location</button>
          </div>
        </div>
    
        {/* Main Content */}
        <div className="flex flex-wrap md:flex-nowrap items-start justify-center mt-10 gap-6 px-4">
          {/* City and Date Card */}
          <div
            className={`flex flex-col items-center justify-center w-full md:w-1/3 p-6 border-2 rounded-3xl shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
          >
            <h1 className="font-extrabold text-2xl text-center">{location?.name || 'Loading...'}</h1>
            <h1 className="font-extrabold text-5xl text-center mt-6">
              {location?.localtime
                ? new Date(location.localtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '--:--'}
            </h1>
            <p className="text-center font-bold text-lg mt-4">
              {location?.localtime
                ? new Date(location.localtime).toLocaleDateString()
                : 'Loading Date...'}
            </p>
          </div>
    
          {/* Weather Information Card */}
          <div
            className={`w-full md:w-2/3 p-6 border-2 rounded-3xl shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
          >
            <h2 className="text-xl font-bold mb-4">Current Weather</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {current && (
              <div className="flex flex-wrap justify-start gap-4">
                <div className="w-full md:w-1/3">
                  <p className="text-5xl font-bold">{current.temp_c}°C</p>
                  <p className="text-base mt-2">Feels like: {current.feelslike_c}°C</p>
                </div>
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <img
                    src={`https:${current.condition.icon}`}
                    alt="Weather Icon"
                    className="w-20 h-20"
                  />
                  <p className="text-lg mt-2">{current.condition.text}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm w-full md:w-1/3">
                  <div>💧 Humidity: {current.humidity}%</div>
                  <div>🌬 Wind Speed: {current.wind_kph} kph</div>
                  <div>🌡 Pressure: {current.pressure_mb} hPa</div>
                  <div>☀️ UV Index: {current.uv}</div>
                </div>
              </div>
            )}
          </div>
        </div>
    
        {/* Forecast Section */}
        <div className="flex flex-wrap md:flex-nowrap justify-center mt-12 gap-6 px-4">
          {/* 5-Day Forecast Card */}
          <div
            className={`w-full md:w-1/3 p-6 border-2 rounded-3xl shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
          >
            <h1 className="text-xl font-bold text-center">5-Day Forecast</h1>
            <div className="mt-4 space-y-3 overflow-y-auto h-64">
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {forecast && forecast.length > 0 ? (
                forecast.map((day) => (
                  <div
                    key={day.date}
                    className={`flex justify-between p-3 border rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
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
                        <p className="text-sm">🌡 {day.day.maxtemp_c}°C / {day.day.mintemp_c}°C</p>
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
    
          {/* Hourly Forecast Card */}
          <div
            className={`w-full md:w-2/3 p-6 border-2 rounded-3xl shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
          >
            <h1 className="text-xl font-bold text-center">Hourly Forecast</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 overflow-y-auto h-64">
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
    );
    
};

export default HomePage;
