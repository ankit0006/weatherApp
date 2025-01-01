import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './components/WeatherSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});
